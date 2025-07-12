CREATE TABLE "user_files"
(
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "originalName" TEXT,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "path" TEXT NOT NULL,
  "etag" TEXT,
  "storageClass" TEXT,
  "channel" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "providerName" TEXT NOT NULL,
  "bucket" TEXT NOT NULL,
  "shortUrlId" TEXT,
  "status" INTEGER NOT NULL DEFAULT 1,
  "lastModified" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "user_files_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_files_userId_providerName_status_lastModified_createdAt_idx" 
ON "user_files"("userId", "providerName", "status", "lastModified", "createdAt");

ALTER TABLE "user_files" ADD CONSTRAINT "user_files_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "plans" ADD COLUMN "stMaxFileSize" TEXT NOT NULL DEFAULT '26214400';
ALTER TABLE "plans" ADD COLUMN "stMaxTotalSize" TEXT NOT NULL DEFAULT '524288000';
ALTER TABLE "plans" ADD COLUMN "stMaxFileCount" INTEGER NOT NULL DEFAULT 1000;

ALTER TABLE "user_files"
ALTER COLUMN size TYPE
FLOAT;
