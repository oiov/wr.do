import { NextResponse } from "next/server";
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { User } from "@prisma/client";

import { createUserFile } from "@/lib/dto/files";
import { getPlanQuota } from "@/lib/dto/plan";
import { getMultipleConfigs } from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import { CloudStorageCredentials, createS3Client } from "@/lib/r2";
import { getCurrentUser } from "@/lib/session";
import { restrictByTimeRange } from "@/lib/team";
import { extractFileNameAndExtension, generateFileKey } from "@/lib/utils";

export async function POST(request: Request): Promise<Response> {
  const user = checkUserStatus(await getCurrentUser());
  if (user instanceof Response) return user;

  const formData = await request.formData();
  const endpoint = formData.get("endPoint");
  const bucket = formData.get("bucket");
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

  switch (endpoint) {
    case "create-multipart-upload":
      return createMultipartUpload(user, formData, R2);
    case "complete-multipart-upload":
      return completeMultipartUpload(
        formData,
        R2,
        user.id,
        configs.s3_config_01,
      );
    case "abort-multipart-upload":
      return abortMultipartUpload(formData, R2);
    case "upload-part":
      return uploadPart(formData, R2);
    default:
      return new Response(JSON.stringify({ error: "Endpoint not found" }), {
        status: 404,
      });
  }
}

// Initiates a multipart upload
async function createMultipartUpload(
  user: User,
  formData: FormData,
  R2: S3Client,
): Promise<Response> {
  const fileName = formData.get("fileName") as string;
  const fileType = formData.get("fileType") as string;
  const fileSize = Number(formData.get("fileSize") as string);
  const bucket = formData.get("bucket") as string;
  const prefix = (formData.get("prefix") as string) || "";

  const plan = await getPlanQuota(user.team!);
  if (Number(fileSize) > Number(plan.stMaxFileSize)) {
    return Response.json("File size limit exceeded", { status: 403 });
  }
  const limit = await restrictByTimeRange({
    model: "userFile",
    userId: user.id,
    limit: Number(plan.stMaxFileCount),
    rangeType: "month",
  });
  if (limit) return Response.json(limit.statusText, { status: limit.status });

  const fileKey = generateFileKey(fileName, prefix);
  try {
    const params = {
      Bucket: bucket,
      Key: fileKey,
      ContentType: fileType,
    };

    const command = new CreateMultipartUploadCommand({ ...params });
    const response = await R2.send(command);

    return new Response(
      JSON.stringify({
        uploadId: response.UploadId,
        key: response.Key,
      }),
      { status: 200 },
    );
  } catch (err) {
    console.log("Error From Create Multipart Upload => ", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// Completes a multipart upload
async function completeMultipartUpload(
  formData: FormData,
  R2: S3Client,
  userId: string,
  bucketInfo: CloudStorageCredentials,
): Promise<Response> {
  const key = formData.get("key") as string;
  const uploadId = formData.get("uploadId") as string;
  const bucket = formData.get("bucket") as string;
  const size = parseInt(formData.get("fileSize") as string);
  const fileType = formData.get("fileType") as string;
  // const fileName = formData.get("fileName") as string;

  const parts = JSON.parse(formData.get("parts") as string);

  try {
    const params = {
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };
    const command = new CompleteMultipartUploadCommand({ ...params });
    const response = await R2.send(command);

    const extractKey = extractFileNameAndExtension(key);

    await createUserFile({
      userId,
      name: extractKey.fileName,
      originalName: extractKey.nameWithoutExtension,
      mimeType: fileType,
      path: key,
      etag: "",
      storageClass: "",
      channel: bucketInfo.channel || "",
      platform: bucketInfo.platform || "",
      providerName: bucketInfo.provider_name || "",
      size,
      bucket,
      lastModified: new Date(),
    });

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (err) {
    console.log("Error", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// Aborts a multipart upload
async function abortMultipartUpload(
  formData: FormData,
  R2: S3Client,
): Promise<Response> {
  const key = formData.get("key") as string;
  const bucket = formData.get("bucket") as string;
  const uploadId = formData.get("uploadId") as string;

  try {
    const params = {
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
    };
    const command = new AbortMultipartUploadCommand({ ...params });
    const response = await R2.send(command);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (err) {
    console.log("Error", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// Uploads a part of a file
async function uploadPart(formData: FormData, R2: S3Client): Promise<Response> {
  const key = formData.get("key") as string;
  const bucket = formData.get("bucket") as string;
  const uploadId = formData.get("uploadId") as string;
  const partNumber = Number(formData.get("partNumber")) as number;
  const chunk = formData.get("chunk") as File;

  try {
    const arrayBuffer = await chunk.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
      Bucket: bucket,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: buffer,
    };

    const command = new UploadPartCommand({ ...params });
    const response = await R2.send(command);

    return new Response(JSON.stringify({ etag: response.ETag }), {
      status: 200,
    });
  } catch (err) {
    console.log("Error From Uploadpart => ", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
