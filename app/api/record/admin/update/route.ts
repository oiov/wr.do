import { updateDNSRecord } from "@/lib/cloudflare";
import { updateUserRecord } from "@/lib/dto/cloudflare-dns-record";
import { getDomainsByFeature } from "@/lib/dto/domains";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Admin access required",
      });
    }

    const zones = await getDomainsByFeature("enable_dns", true);
    if (!zones.length) {
      return Response.json(
        "API key, zone configuration, and email are required",
        { status: 401, statusText: "Missing required configuration" },
      );
    }

    const { record, recordId, userId } = await req.json();
    if (!record || !recordId || !userId) {
      return Response.json("record, recordId, and userId are required", {
        status: 400,
        statusText: "Invalid request body",
      });
    }

    let record_name = ["A", "CNAME", "AAAA"].includes(record.type)
      ? record.name
      : `${record.name}.${record.zone_name}`;

    let matchedZone;

    for (const zone of zones) {
      if (record.zone_name === zone.domain_name) {
        matchedZone = zone;
        break;
      }
    }

    if (!matchedZone) {
      return Response.json(
        `No matching zone found for domain: ${record_name}`,
        {
          status: 400,
          statusText: "Invalid domain",
        },
      );
    }

    const data = await updateDNSRecord(
      matchedZone.cf_zone_id,
      matchedZone.cf_api_key,
      matchedZone.cf_email,
      recordId,
      { ...record, name: record_name },
    );

    if (!data.success || !data.result?.id) {
      return Response.json(
        data.errors?.[0]?.message || "Failed to update DNS record",
        {
          status: 501,
          statusText: "Cloudflare API error",
        },
      );
    }

    const res = await updateUserRecord(userId, {
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
      modified_on: data.result.modified_on,
      active: 1,
    });

    if (res.status !== "success") {
      return Response.json(res.status, {
        status: 502,
        statusText: "Failed to update user record",
      });
    }

    return Response.json(res.data, {
      status: 200,
      statusText: "success",
    });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", {
      status: error?.status || 500,
      statusText: error?.statusText || "Server error",
    });
  }
}
