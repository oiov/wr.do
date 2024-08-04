import { env } from "@/env.mjs";
import { deleteDNSRecord } from "@/lib/cloudflare";
import { deleteUserRecord } from "@/lib/dto/cloudflare-dns-record";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const { record_id, zone_id, userId, active } = await req.json();
    if (!record_id || !userId) {
      return Response.json("RecordId and userId are required", {
        status: 400,
        statusText: "RecordId and userId are required",
      });
    }

    const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;
    if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_KEY || !CLOUDFLARE_EMAIL) {
      return Response.json("API key、zone iD and email are required", {
        status: 400,
        statusText: "API key、zone iD and email are required",
      });
    }

    // Delete cf dns record first.
    const res = await deleteDNSRecord(
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      record_id,
    );
    if (res && res.result?.id) {
      // Then delete user record.
      await deleteUserRecord(userId, record_id, zone_id, active);
      return Response.json("success", {
        status: 200,
        statusText: "success",
      });
    }
    return Response.json({
      status: 501,
      statusText: "Not Implemented",
    });
  } catch (error) {
    console.error(error);
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
