import { env } from "@/env.mjs";
import { deleteDNSRecord } from "@/lib/cloudflare";
import { deleteUserRecord } from "@/lib/dto/cloudflare-dns-record";
import { getDomainsByFeature } from "@/lib/dto/domains";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { record_id, zone_id, active } = await req.json();

    const zones = await getDomainsByFeature("enable_dns", true);
    if (!zones.length) {
      return Response.json("Please add at least one domain", {
        status: 400,
        statusText: "Please add at least one domain",
      });
    }

    const matchedZone = zones.find((zone) => zone.cf_zone_id === zone_id);
    if (!matchedZone) {
      return Response.json(`Invalid or unsupported zone_id: ${zone_id}`, {
        status: 400,
        statusText: "Invalid zone_id",
      });
    }

    if (active !== 3) {
      const res = await deleteDNSRecord(
        matchedZone.cf_zone_id!,
        matchedZone.cf_api_key!,
        matchedZone.cf_email!,
        record_id,
      );

      if (res && res.result?.id) {
        await deleteUserRecord(user.id, record_id, zone_id, active);
        return Response.json("success", {
          status: 200,
          statusText: "success",
        });
      }
    } else {
      await deleteUserRecord(user.id, record_id, zone_id, active);
      return Response.json("success", {
        status: 200,
        statusText: "success",
      });
    }

    return Response.json({
      status: 501,
      statusText: "Failed to delete DNS record",
    });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
