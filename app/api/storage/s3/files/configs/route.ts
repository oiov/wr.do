import { NextRequest, NextResponse } from "next/server";

import { getMultipleConfigs } from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const configs = await getMultipleConfigs(["s3_config_list"]);
    if (!configs || !configs.s3_config_list) {
      return NextResponse.json("Invalid S3 configs", {
        status: 400,
      });
    }

    const processedList = configs.s3_config_list
      .filter((c) => c.enabled && c.buckets?.length > 0)
      .map((c) => ({
        provider_name: c.provider_name,
        platform: c.platform,
        channel: c.channel,
        enabled: c.enabled,
        buckets: c.buckets.filter((b) => b?.bucket && b?.public),
      }))
      .filter((c) => c.buckets.length > 0);

    if (processedList.length === 0) {
      return NextResponse.json("No buckets found", {
        status: 404,
      });
    }

    return NextResponse.json(processedList);
  } catch (error) {
    return NextResponse.json("Error listing buckets", { status: 500 });
  }
}
