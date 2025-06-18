import { createDNSRecord } from "@/lib/cloudflare";
import { updateUserRecordReview } from "@/lib/dto/cloudflare-dns-record";
import { getDomainsByFeature } from "@/lib/dto/domains";
import { checkUserStatus } from "@/lib/dto/user";
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

    const { record: reviewRecord, userId, recordId, id } = await req.json();
    const record = {
      ...reviewRecord,
      recordId,
    };

    let matchedZone;

    for (const zone of zones) {
      if (record.zone_name === zone.domain_name) {
        matchedZone = zone;
        break;
      }
    }

    // const data = await createDNSRecord(
    //   matchedZone.cf_zone_id,
    //   matchedZone.cf_api_key,
    //   matchedZone.cf_email,
    //   record,
    // );

    const res = await updateUserRecordReview(userId, id, {
      record_id: recordId,
      zone_id: matchedZone.cf_zone_id,
      zone_name: matchedZone.domain_name,
      name: record.name,
      type: record.type,
      content: record.content,
      proxied: record.proxied,
      proxiable: record.proxiable,
      ttl: record.ttl,
      comment: record.comment ?? "",
      tags: "",
      created_on: new Date().toISOString(),
      modified_on: new Date().toISOString(),
      active: 3,
    });

    if (res.status !== "success") {
      return Response.json(res.status, {
        status: 502,
      });
    }
    return Response.json(res.data);
  } catch (error) {
    console.error("[错误]", error);
    return Response.json(error, {
      status: error?.status || 500,
    });
  }
}
