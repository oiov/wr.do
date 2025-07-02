import { NextRequest, NextResponse } from "next/server";

import { getMultipleConfigs } from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import {
  createS3Client,
  deleteFile,
  getSignedUrlForDownload,
  listFiles,
} from "@/lib/r2";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(req.url);
    const bucket = url.searchParams.get("bucket") || "";

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

    const files = await listFiles(
      configs.s3_config_01.prefix || "",
      createS3Client(
        configs.s3_config_01.endpoint,
        configs.s3_config_01.access_key_id,
        configs.s3_config_01.secret_access_key,
      ),
      bucket,
    );
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: "Error listing files" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { key, bucket } = await request.json();
    if (!key || !bucket) {
      return NextResponse.json("key and bucket is required", {
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

    const signedUrl = await getSignedUrlForDownload(
      key,
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
      { error: "Error generating download URL" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { key, bucket } = await request.json();

    if (!key || !bucket) {
      return NextResponse.json("key and bucket is required", {
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
    await deleteFile(
      key,
      createS3Client(
        configs.s3_config_01.endpoint,
        configs.s3_config_01.access_key_id,
        configs.s3_config_01.secret_access_key,
      ),
      bucket,
    );
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 });
  }
}
