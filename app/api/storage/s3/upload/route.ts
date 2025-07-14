import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getPlanQuota } from "@/lib/dto/plan";
import { getMultipleConfigs } from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import { createS3Client } from "@/lib/r2";
import { getCurrentUser } from "@/lib/session";
import { restrictByTimeRange } from "@/lib/team";
import { generateFileKey } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { provider, bucket, files, prefix } = await request.json();

    if (!bucket || !files || !Array.isArray(files)) {
      return NextResponse.json("Invalid request parameters", { status: 400 });
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

    const plan = await getPlanQuota(user.team!);
    for (const file of files) {
      if (Number(file.size) > Number(plan.stMaxFileSize)) {
        return Response.json(`File (${file.name}) size limit exceeded`, {
          status: 403,
        });
      }
    }
    const limit = await restrictByTimeRange({
      model: "userFile",
      userId: user.id,
      limit: Number(plan.stMaxFileCount),
      rangeType: "month",
    });
    if (limit) return Response.json(limit.statusText, { status: limit.status });

    const R2 = createS3Client(
      providerChannel.endpoint,
      providerChannel.access_key_id,
      providerChannel.secret_access_key,
    );

    const signedUrls = await Promise.all(
      files.map(async (file: { name: string; type: string; size: number }) => {
        const fileName = generateFileKey(file.name, prefix || "");

        const signedUrl = await getSignedUrl(
          R2,
          new PutObjectCommand({
            Bucket: bucket,
            Key: fileName,
            ContentType: file.type,
            ContentLength: file.size,
          }),
          { expiresIn: 600 }, // 10分钟过期时间
        );

        return {
          originalName: file.name,
          fileName,
          url: signedUrl,
          type: file.type,
          size: file.size,
        };
      }),
    );

    return NextResponse.json({ urls: signedUrls });
  } catch (error) {
    console.error("生成预签名 URL 失败:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// Get download url
export async function GET(request: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(request.url);
    const path = url.searchParams.get("path");
    const bucket = url.searchParams.get("bucket");

    if (!path || !bucket) {
      return NextResponse.json("Invalid request parameters", {
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

    const pre_url = await getSignedUrl(
      R2,
      new GetObjectCommand({
        Bucket: bucket,
        Key: path,
      }),
      {
        expiresIn: 600,
      },
    );
    return Response.json({ url: pre_url });
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}
