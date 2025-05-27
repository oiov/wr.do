/*
  Warnings:

  - The primary key for the `domains` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_emails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_send_emails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `enable_short_link` on table `domains` required. This step will fail if there are existing NULL values in that column.
  - Made the column `enable_email` on table `domains` required. This step will fail if there are existing NULL values in that column.
  - Made the column `enable_dns` on table `domains` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cf_api_key_encrypted` on table `domains` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `domains` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `user_records` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tags` on table `user_records` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "forward_emails" DROP CONSTRAINT "forward_emails_to_fkey";

-- DropIndex
DROP INDEX "user_records_created_on_idx";

-- DropIndex
DROP INDEX "user_records_userId_idx";

-- DropIndex
DROP INDEX "user_send_emails_userId_idx";

-- DropIndex
DROP INDEX "user_urls_createdAt_idx";

-- DropIndex
DROP INDEX "user_urls_userId_idx";

-- AlterTable
ALTER TABLE "domains" DROP CONSTRAINT "domains_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "enable_short_link" SET NOT NULL,
ALTER COLUMN "enable_email" SET NOT NULL,
ALTER COLUMN "enable_dns" SET NOT NULL,
ALTER COLUMN "cf_zone_id" DROP NOT NULL,
ALTER COLUMN "cf_api_key" DROP NOT NULL,
ALTER COLUMN "cf_email" DROP NOT NULL,
ALTER COLUMN "cf_api_key_encrypted" SET NOT NULL,
ALTER COLUMN "cf_api_key_encrypted" DROP DEFAULT,
ALTER COLUMN "active" SET NOT NULL,
ADD CONSTRAINT "domains_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "forward_emails" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "readAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "scrape_metas" ALTER COLUMN "link" DROP DEFAULT;

-- AlterTable
ALTER TABLE "url_metas" ALTER COLUMN "ip" SET DEFAULT '127.0.0.1';

-- AlterTable
ALTER TABLE "user_emails" DROP CONSTRAINT "user_emails_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ADD CONSTRAINT "user_emails_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_records" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "tags" SET NOT NULL,
ALTER COLUMN "created_on" DROP NOT NULL,
ALTER COLUMN "created_on" DROP DEFAULT,
ALTER COLUMN "modified_on" DROP NOT NULL,
ALTER COLUMN "modified_on" DROP DEFAULT,
ALTER COLUMN "active" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_send_emails" DROP CONSTRAINT "user_send_emails_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ADD CONSTRAINT "user_send_emails_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_urls" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "adsterraApiKey" TEXT DEFAULT '',
ADD COLUMN     "adsterraDomainId" TEXT DEFAULT '',
ALTER COLUMN "team" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "user_records_userId_created_on_idx" ON "user_records"("userId", "created_on");

-- CreateIndex
CREATE INDEX "user_send_emails_createdAt_idx" ON "user_send_emails"("createdAt");

-- CreateIndex
CREATE INDEX "user_urls_userId_created_at_idx" ON "user_urls"("userId", "created_at");

-- AddForeignKey
ALTER TABLE "forward_emails" ADD CONSTRAINT "forward_emails_to_fkey" FOREIGN KEY ("to") REFERENCES "user_emails"("emailAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_send_emails" ADD CONSTRAINT "user_send_emails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "unique_urlId_ip" RENAME TO "url_metas_urlId_ip_key";

-- RenameIndex
ALTER INDEX "users_createdAt_idx" RENAME TO "users_created_at_idx";
