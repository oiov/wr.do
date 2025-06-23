import { updateDNSRecord } from "@/lib/cloudflare";
import {
  updateUserRecord,
  updateUserRecordState,
} from "@/lib/dto/cloudflare-dns-record";
import { getDomainsByFeature } from "@/lib/dto/domains";
import { checkUserStatus } from "@/lib/dto/user";
import { reservedDomains } from "@/lib/enums";
import { getCurrentUser } from "@/lib/session";

// Update DNS record
export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const zones = await getDomainsByFeature("enable_dns", true);
    if (!zones.length) {
      return Response.json(
        "API key, zone configuration, and email are required",
        { status: 401, statusText: "Missing required configuration" },
      );
    }

    const { record, recordId } = await req.json();
    if (!record || !recordId) {
      return Response.json("Record and recordId are required", {
        status: 400,
        statusText: "Invalid request body",
      });
    }

    if (reservedDomains.includes(record.name)) {
      return Response.json("Domain name is reserved", {
        status: 403,
        statusText: "Reserved domain",
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
        { status: 501, statusText: "Cloudflare API error" },
      );
    }

    const res = await updateUserRecord(user.id, {
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

    return Response.json(res.data);
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", {
      status: error?.status || 500,
      statusText: error?.statusText || "Server error",
    });
  }
}

// Update record state
export async function PUT(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const zones = await getDomainsByFeature("enable_dns", true);
    if (!zones.length) {
      return Response.json(
        "API key, zone configuration, and email are required",
        { status: 401, statusText: "Missing required configuration" },
      );
    }

    const { zone_id, record_id, target, active } = await req.json();
    if (!zone_id || !record_id || !target) {
      return Response.json("zone_id, record_id, and target are required", {
        status: 400,
        statusText: "Invalid request body",
      });
    }

    const matchedZone = zones.find((zone) => zone.cf_zone_id === zone_id);
    if (!matchedZone) {
      return Response.json(`Invalid or unsupported zone_id: ${zone_id}`, {
        status: 400,
        statusText: "Invalid zone_id",
      });
    }

    let isTargetAccessible = false;
    try {
      const target_res = await fetch(`https://${target}`, {
        method: "HEAD",
        signal: AbortSignal.timeout(10000),
      });
      isTargetAccessible = target_res.status === 200;
    } catch (fetchError) {
      isTargetAccessible = false;
      // console.log(
      //   `[Fetch Error] Failed to access target ${target}: ${fetchError}`,
      // );
    }

    const res = await updateUserRecordState(
      user.id,
      record_id,
      zone_id,
      isTargetAccessible ? 1 : 0,
    );

    if (!res) {
      return Response.json("Failed to update record state", {
        status: 502,
        statusText: "Database error",
      });
    }

    return Response.json(
      isTargetAccessible ? "Target is accessible!" : "Target is unaccessible!",
      { status: 200 },
    );
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(
      `An error occurred: ${error.message || "Unknown error"}`,
      {
        status: 500,
        statusText: "Server error",
      },
    );
  }
}
