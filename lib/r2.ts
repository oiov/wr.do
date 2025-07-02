import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getMultipleConfigs } from "./dto/system-config";

export interface CloudStorageCredentials {
  enabled?: boolean;
  platform?: string;
  channel?: string;
  provider_name?: string;
  account_id?: string;
  access_key_id?: string;
  secret_access_key?: string;
  bucket?: string;
  endpoint?: string;
  region?: string;
  custom_domain?: string;
  prefix?: string;
  file_types?: string;
}

export interface ClientStorageCredentials {
  enabled?: boolean;
  platform?: string;
  channel?: string;
  provider_name?: string;
  buckets?: string[];
  region?: string;
  custom_domain?: string[];
  prefix?: string;
  file_types?: string[];
}

export interface FileObject {
  Key?: string;
  LastModified?: Date;
  ETag?: string;
  Size?: number;
  StorageClass?: string;
}

export function createS3Client(
  endpoint: string,
  accessKeyId: string,
  secretAccessKey: string,
  region: string = "auto",
) {
  return new S3Client({
    region: region,
    endpoint: endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function uploadFile(
  file: Buffer,
  key: string,
  s3: S3Client,
  bucket: string,
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
  });

  try {
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function getSignedUrlForUpload(
  key: string,
  contentType: string,
  s3: S3Client,
  bucket: string,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}

export async function getSignedUrlForDownload(
  key: string,
  s3: S3Client,
  bucket: string,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}

export async function listFiles(
  prefix: string = "",
  s3: S3Client,
  bucket: string,
): Promise<FileObject[]> {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  try {
    const response = await s3.send(command);
    return response.Contents || [];
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}

export async function deleteFile(key: string, s3: S3Client, bucket: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
