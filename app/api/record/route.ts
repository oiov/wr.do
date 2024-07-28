import { getUserRecords } from "@/actions/cloudflare-dns-record";

import { env } from "@/env.mjs";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    // const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;

    const user_records = await getUserRecords(user.id, 1);

    return Response.json(user_records);
  } catch (error) {
    return Response.json(error, {
      status: 500,
      statusText: "Server error",
    });
  }
}
