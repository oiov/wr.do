import { NextRequest, NextResponse } from "next/server";

import { getMultipleConfigs } from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const configs = await getMultipleConfigs(["s3_config_01"]);

    if (
      !configs.s3_config_01 ||
      !configs.s3_config_01.enabled ||
      !configs.s3_config_01.bucket
    ) {
      return NextResponse.json({ error: "Invalid S3 config" }, { status: 400 });
    }

    return NextResponse.json({
      buckets: configs.s3_config_01.bucket.split(","),
      custom_domain: configs.s3_config_01.custom_domain.split(","),
      prefix: configs.s3_config_01.prefix,
      enabled: configs.s3_config_01.enabled,
      region: configs.s3_config_01.region,
      file_types: configs.s3_config_01.file_types.split(","),
      provider_name: configs.s3_config_01.provider_name,
      platform: configs.s3_config_01.platform,
      channel: configs.s3_config_01.channel,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error listing files" }, { status: 500 });
  }
}
