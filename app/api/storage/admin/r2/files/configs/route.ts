import { NextRequest, NextResponse } from "next/server";

import { getMultipleConfigs } from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const configs = await getMultipleConfigs(["s3_config_01"]);

    if (!configs.s3_config_01 || !configs.s3_config_01.enabled) {
      return NextResponse.json({ error: "Invalid S3 config" }, { status: 400 });
    }

    return NextResponse.json({
      buckets: configs.s3_config_01.buckets,
      enabled: configs.s3_config_01.enabled,
      provider_name: configs.s3_config_01.provider_name,
      platform: configs.s3_config_01.platform,
      channel: configs.s3_config_01.channel,
    });
  } catch (error) {
    console.error("[Error]", error);
    return NextResponse.json("Error listing buckets", { status: 500 });
  }
}
