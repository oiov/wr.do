-- AlterTable
ALTER TABLE "url_metas" ADD COLUMN "engine" TEXT;

ALTER TABLE "url_metas" ADD COLUMN "os" TEXT;

ALTER TABLE "url_metas" ADD COLUMN "cpu" TEXT;

ALTER TABLE "url_metas" ADD COLUMN "isBot" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "domains" ADD COLUMN "resend_api_key" TEXT;



