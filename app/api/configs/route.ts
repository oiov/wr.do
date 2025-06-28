import { NextRequest } from "next/server";

import { getMultipleConfigs } from "@/lib/dto/system-config";

export const dynamic = "force-dynamic";

const allowed_keys = [
  "enable_user_registration",
  "enable_subdomain_apply",
  "system_notification",
];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const keys = url.searchParams.getAll("key") || [];

    if (keys.length === 0) {
      return Response.json("key is required", { status: 400 });
    }

    for (const key of keys) {
      if (!allowed_keys.includes(key)) {
        return Response.json("Invalid key", { status: 400 });
      }
    }

    const configs = await getMultipleConfigs(keys);

    return Response.json(configs, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
