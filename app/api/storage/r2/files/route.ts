import { NextRequest, NextResponse } from "next/server";

import { getUserFiles, softDeleteUserFiles } from "@/lib/dto/files";
import { getMultipleConfigs } from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import { createS3Client, deleteFile, getSignedUrlForDownload } from "@/lib/r2";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const pageSize = url.searchParams.get("pageSize");
    const bucket = url.searchParams.get("bucket") || "";
    const name = url.searchParams.get("name") || "";
    const fileSize = url.searchParams.get("fileSize") || "";
    const mimeType = url.searchParams.get("mimeType") || "";

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
    const buckets = configs.s3_config_01.buckets || [];
    if (!buckets.find((b) => b.bucket === bucket)) {
      return NextResponse.json("Bucket does not exist", {
        status: 403,
      });
    }

    const res = await getUserFiles({
      page: Number(page) || 1,
      limit: Number(pageSize) || 20,
      bucket,
      userId: user.id,
      status: 1,
      channel: configs.s3_config_01.channel,
      platform: configs.s3_config_01.platform,
      name,
      size: Number(fileSize || 0),
      mimeType,
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error listing files:", error);
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
    const buckets = configs.s3_config_01.buckets || [];
    if (!buckets.find((b) => b.bucket === bucket)) {
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

    const { keys, ids, bucket } = await request.json();

    if (!keys || !ids || !bucket) {
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
    const buckets = configs.s3_config_01.buckets || [];
    if (!buckets.find((b) => b.bucket === bucket)) {
      return NextResponse.json("Bucket does not exist", {
        status: 403,
      });
    }

    const R2 = createS3Client(
      configs.s3_config_01.endpoint,
      configs.s3_config_01.access_key_id,
      configs.s3_config_01.secret_access_key,
    );

    for (const key of keys) {
      await deleteFile(key, R2, bucket);
    }
    await softDeleteUserFiles(ids);
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 });
  }
}
