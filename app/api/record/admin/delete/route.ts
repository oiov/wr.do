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
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Admin access required",
      });
    }

    const { record_id, zone_id, userId, active } = await req.json();
    if (!record_id || !userId || !zone_id) {
      return Response.json("record_id, userId, and zone_id are required", {
        status: 400,
        statusText: "Invalid request body",
      });
    }

    const { CLOUDFLARE_ZONE, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;
    const zones = parseZones(CLOUDFLARE_ZONE || "[]");

    if (!zones.length || !CLOUDFLARE_API_KEY || !CLOUDFLARE_EMAIL) {
      return Response.json(
        "API key, zone configuration, and email are required",
        {
          status: 400,
          statusText: "Missing required configuration",
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

    // force delete
    await deleteUserRecord(userId, record_id, zone_id, active);
    await deleteDNSRecord(
      matchedZone.zone_id,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      record_id,
    );

    return Response.json("success", {
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
