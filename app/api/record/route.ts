import { getUserRecords } from "@/actions/cloudflare-dns-record";

import { env } from "@/env.mjs";
import { getCurrentUser } from "@/lib/session";
import { checkUserStatus } from "@/lib/user";

export async function GET(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    // const { CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_EMAIL } = env;

    const user_records = await getUserRecords(user.id, 1);

    return Response.json(user_records);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
