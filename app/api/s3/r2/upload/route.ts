import { NextRequest, NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";

import { getMultipleConfigs } from "@/lib/dto/system-config";
import { createS3Client, getSignedUrlForUpload } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, bucket } = await request.json();
    if (!fileName || !fileType || !bucket) {
      return NextResponse.json("fileName, fileType and bucket is required", {
        status: 400,
      });
    }
    const configs = await getMultipleConfigs(["s3_config_01"]);
    if (!configs.s3_config_01.enabled) {
      return NextResponse.json("S3 is not enabled", {
        status: 403,
      });
    }
    if (
      !configs.s3_config_01 ||
      !configs.s3_config_01.access_key_id ||
      !configs.s3_config_01.secret_access_key ||
      !configs.s3_config_01.endpoint
    ) {
      return NextResponse.json("Invalid S3 config", {
        status: 403,
      });
    }
    const buckets = configs.s3_config_01.bucket.split(",");
    if (!buckets.includes(bucket)) {
      return NextResponse.json("Bucket does not exist", {
        status: 403,
      });
    }
    const signedUrl = await getSignedUrlForUpload(
      fileName,
      fileType,
      createS3Client(
        configs.s3_config_01.endpoint,
        configs.s3_config_01.access_key_id,
        configs.s3_config_01.secret_access_key,
      ),
      bucket,
    );
    return NextResponse.json({ signedUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Error generating signed URL" },
      { status: 500 },
    );
  }
}
