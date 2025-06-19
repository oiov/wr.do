-- AlterTable
ALTER TABLE "domains" ADD COLUMN "min_url_length" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "domains" ADD COLUMN "min_email_length" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "domains" ADD COLUMN "min_record_length" INTEGER NOT NULL DEFAULT 1;



