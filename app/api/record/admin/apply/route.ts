import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { createDNSRecord } from "@/lib/cloudflare";
import { updateUserRecordReview } from "@/lib/dto/cloudflare-dns-record";
import { getDomainsByFeature } from "@/lib/dto/domains";
import { checkUserStatus, getUserById } from "@/lib/dto/user";
import { applyRecordToUserEmailHtml, resend } from "@/lib/email";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const zones = await getDomainsByFeature("enable_dns", true);
    if (!zones.length) {
      return Response.json("Please add at least one domain", {
        status: 400,
        statusText: "Please add at least one domain",
      });
    }

    const { record: reviewRecord, userId, id } = await req.json();
    const record = {
      ...reviewRecord,
      id,
    };

    let matchedZone;

    for (const zone of zones) {
      if (record.zone_name === zone.domain_name) {
        matchedZone = zone;
        break;
      }
    }

    const data = await createDNSRecord(
      matchedZone.cf_zone_id,
      matchedZone.cf_api_key,
      matchedZone.cf_email,
      record,
    );

    // console.log("[data]", data);

    if (!data.success || !data.result?.id) {
      return Response.json(data.errors[0].message, {
        status: 503,
      });
    } else {
      const res = await updateUserRecordReview(userId, id, {
        record_id: data.result.id,
        zone_id: matchedZone.cf_zone_id,
        zone_name: matchedZone.domain_name,
        name: data.result.name,
        type: data.result.type,
        content: data.result.content,
        proxied: data.result.proxied,
        proxiable: data.result.proxiable,
        ttl: data.result.ttl,
        comment: data.result.comment ?? "",
        tags: data.result.tags?.join("") ?? "",
        created_on: data.result.created_on,
        modified_on: data.result.modified_on,
        active: 0,
      });

      const userInfo = await getUserById(userId);
      if (userInfo) {
        await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: userInfo.email || "",
          subject: "Your subdomain has been applied",
          html: applyRecordToUserEmailHtml({
            appUrl: siteConfig.url,
            appName: siteConfig.name,
            subdomain: data.result.name,
          }),
        });
      }

      if (res.status !== "success") {
        return Response.json(res.status, {
          status: 502,
        });
      }
      return Response.json(res.data);
    }
  } catch (error) {
    console.error("[错误]", error);
    return Response.json(error, {
      status: error?.status || 500,
    });
  }
}
