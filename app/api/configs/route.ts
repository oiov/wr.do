import { NextRequest } from "next/server";

import { getMultipleConfigs } from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const configs = await getMultipleConfigs([
      "enable_user_registration",
      "enable_subdomain_apply",
      "system_notification",
    ]);

    return Response.json(configs, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
