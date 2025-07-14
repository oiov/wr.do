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
    const provider = url.searchParams.get("provider") || "";
    const name = url.searchParams.get("name") || "";
    const fileSize = url.searchParams.get("fileSize") || "";
    const mimeType = url.searchParams.get("mimeType") || "";

    const configs = await getMultipleConfigs(["s3_config_list"]);
    if (!configs || !configs.s3_config_list) {
      return NextResponse.json("Invalid S3 configs", {
        status: 400,
      });
    }

    const providerChannel = configs.s3_config_list.find(
      (c) => c.provider_name === provider,
    );
    if (!providerChannel) {
      return NextResponse.json("Provider does not exist", {
        status: 400,
      });
    }

    const buckets = providerChannel.buckets || [];
    if (!buckets.find((b) => b.bucket === bucket)) {
      return NextResponse.json("Bucket does not exist", {
        status: 400,
      });
    }

    const res = await getUserFiles({
      page: Number(page) || 1,
      limit: Number(pageSize) || 20,
      bucket,
      userId: user.id,
      status: 1,
      channel: providerChannel.channel,
      platform: providerChannel.platform,
      providerName: providerChannel.provider_name,
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

    const { key, bucket, provider } = await request.json();
    if (!key || !bucket || !provider) {
      return NextResponse.json("key and bucket is required", {
        status: 400,
      });
    }

    const configs = await getMultipleConfigs(["s3_config_list"]);
    if (!configs || !configs.s3_config_list) {
      return NextResponse.json("Invalid S3 configs", {
        status: 400,
      });
    }

    const providerChannel = configs.s3_config_list.find(
      (c) => c.provider_name === provider,
    );
    if (!providerChannel) {
      return NextResponse.json("Provider does not exist", {
        status: 400,
      });
    }

    const buckets = providerChannel.buckets || [];
    if (!buckets.find((b) => b.bucket === bucket)) {
      return NextResponse.json("Bucket does not exist", {
        status: 400,
      });
    }

    const signedUrl = await getSignedUrlForDownload(
      key,
      createS3Client(
        providerChannel.endpoint,
        providerChannel.access_key_id,
        providerChannel.secret_access_key,
      ),
      bucket,
    );
    return NextResponse.json({ signedUrl });
  } catch (error) {
    return NextResponse.json("Error generating download URL", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { keys, ids, bucket, provider } = await request.json();

    if (!keys || !ids || !bucket || !provider) {
      return NextResponse.json("key and bucket is required", {
        status: 400,
      });
    }

    const configs = await getMultipleConfigs(["s3_config_list"]);
    if (!configs || !configs.s3_config_list) {
      return NextResponse.json("Invalid S3 configs", {
        status: 400,
      });
    }

    const providerChannel = configs.s3_config_list.find(
      (c) => c.provider_name === provider,
    );
    if (!providerChannel) {
      return NextResponse.json("Provider does not exist", {
        status: 400,
      });
    }

    const buckets = providerChannel.buckets || [];
    if (!buckets.find((b) => b.bucket === bucket)) {
      return NextResponse.json("Bucket does not exist", {
        status: 400,
      });
    }

    const R2 = createS3Client(
      providerChannel.endpoint,
      providerChannel.access_key_id,
      providerChannel.secret_access_key,
    );

    for (const key of keys) {
      await deleteFile(key, R2, bucket);
    }
    await softDeleteUserFiles(ids);
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    return NextResponse.json("Error deleting file", { status: 500 });
  }
}
