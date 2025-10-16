-- AlterTable
ALTER TABLE "domains" ADD COLUMN "brevo_api_key" TEXT;

ALTER TABLE "domains" ADD COLUMN "email_provider" TEXT NOT NULL DEFAULT 'Resend';
