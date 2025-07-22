import { NextRequest, NextResponse } from "next/server";

import { getBucketStorageUsage } from "@/lib/dto/files";
import { getMultipleConfigs } from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(request.url);
    const bucket = url.searchParams.get("bucket");
    const provider = url.searchParams.get("provider");

    if (!bucket || !provider) {
      return NextResponse.json("Missing bucket or provider parameters", {
        status: 400,
      });
    }

    // 获取存储桶配置
    const configs = await getMultipleConfigs(["s3_config_list"]);
    if (!configs || !configs.s3_config_list) {
      return NextResponse.json("Invalid S3 configs", {
        status: 400,
      });
    }

    const providerConfig = configs.s3_config_list.find(
      (c) => c.provider_name === provider,
    );
    if (!providerConfig) {
      return NextResponse.json("Provider does not exist", {
        status: 400,
      });
    }

    const bucketConfig = providerConfig.buckets?.find(
      (b) => b.bucket === bucket,
    );
    if (!bucketConfig) {
      return NextResponse.json("Bucket does not exist", {
        status: 400,
      });
    }

    // 获取存储桶使用情况
    const bucketUsage = await getBucketStorageUsage(bucket, provider);
    if (!bucketUsage.success) {
      return NextResponse.json("Failed to get bucket usage", {
        status: 500,
      });
    }

    return NextResponse.json({
      bucket: bucket,
      provider: provider,
      usage: {
        totalSize: bucketUsage.data.totalSize,
        totalFiles: bucketUsage.data.totalFiles,
      },
      limits: {
        maxStorage: bucketConfig.max_storage ? Number(bucketConfig.max_storage) : null,
      },
    });
  } catch (error) {
    console.error("Error getting bucket usage:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}