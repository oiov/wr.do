import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface CloudStorageCredentials {
  enabled?: boolean;
  platform?: string;
  channel?: string;
  provider_name?: string;
  account_id?: string;
  access_key_id?: string;
  secret_access_key?: string;
  endpoint?: string;
  buckets: BucketItem[];
}

export interface ClientStorageCredentials {
  enabled?: boolean;
  platform?: string;
  channel?: string;
  provider_name?: string;
  buckets: BucketItem[];
}

export interface BucketItem {
  bucket: string;
  custom_domain?: string;
  prefix?: string;
  file_types?: string;
  file_size?: string;
  region?: string;
  public: boolean;
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

export async function getFileInfo(R2: S3Client, bucket: string, key: string) {
  try {
    const headCommand = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const headResponse = await R2.send(headCommand);

    return {
      size: headResponse.ContentLength || 0,
      etag: headResponse.ETag || "",
      lastModified: headResponse.LastModified || new Date(),
      contentType: headResponse.ContentType || "",
      storageClass: headResponse.StorageClass || "",
      metadata: headResponse.Metadata || {},
    };
  } catch (error) {
    console.error("Error getting file info:", error);
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
