import { deleteUserRecord } from "@/actions/cloudflare-dns-record";

import { env } from "@/env.mjs";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const { record_id, zone_id, active } = await req.json();
    const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;

    await deleteUserRecord(user.id, record_id, zone_id, active);
    // await
  } catch (error) {
    console.error(error);
    return Response.json(error, {
      status: 500,
      statusText: "Server error",
    });
  }
}
