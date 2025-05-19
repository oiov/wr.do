import { env } from "@/env.mjs";
import { deleteDNSRecord } from "@/lib/cloudflare";
import { deleteUserRecord } from "@/lib/dto/cloudflare-dns-record";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { parseZones } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { record_id, zone_id, active } = await req.json();

    const { CLOUDFLARE_ZONE, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;
    const zones = parseZones(CLOUDFLARE_ZONE || "[]");

    if (!zones.length || !CLOUDFLARE_API_KEY || !CLOUDFLARE_EMAIL) {
      return Response.json(
        "API key, zone configuration, and email are required",
        {
          status: 400,
          statusText: "API key, zone configuration, and email are required",
        },
      );
    }

    const matchedZone = zones.find((zone) => zone.zone_id === zone_id);
    if (!matchedZone) {
      return Response.json(`Invalid or unsupported zone_id: ${zone_id}`, {
        status: 400,
        statusText: "Invalid zone_id",
      });
    }

    const res = await deleteDNSRecord(
      matchedZone.zone_id,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      record_id,
    );

    if (res && res.result?.id) {
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
