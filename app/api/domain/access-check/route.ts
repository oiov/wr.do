import { NextRequest } from "next/server";

import { getZoneDetail } from "@/lib/cloudflare";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(req.url);
    const zone_id = url.searchParams.get("zone_id") || "";
    const api_key = url.searchParams.get("api_key") || "";
    const email = url.searchParams.get("email") || "";

    const res = await getZoneDetail(zone_id, api_key, email);

    if (res === 200) return Response.json(200, { status: 200 });
    else return Response.json(400, { status: 400 });
  } catch (error) {
    return Response.json(500, { status: 500 });
  }
}
