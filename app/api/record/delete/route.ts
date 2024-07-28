import { deleteUserRecord } from "@/actions/cloudflare-dns-record";

import { env } from "@/env.mjs";
import { deleteDNSRecord } from "@/lib/cloudflare";
import { getCurrentUser } from "@/lib/session";
import { checkUserStatus } from "@/lib/user";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { record_id, zone_id, active } = await req.json();
    const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;

    // Delete cf dns record first.
    const res = await deleteDNSRecord(
      CLOUDFLARE_ZONE_ID,
      CLOUDFLARE_API_KEY,
      CLOUDFLARE_EMAIL,
      record_id,
    );
    if (res && res.result?.id) {
      // Then delete user record.
      await deleteUserRecord(user.id, record_id, zone_id, active);
      return Response.json({
        status: 200,
        statusText: "success",
      });
    }
  } catch (error) {
    console.error(error);
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
