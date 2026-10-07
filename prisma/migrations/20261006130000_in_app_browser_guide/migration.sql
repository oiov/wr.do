ALTER TABLE "user_urls"
ADD COLUMN "in_app_browser_guide_override" BOOLEAN;

ALTER TABLE "domains"
ADD COLUMN "in_app_browser_guide_enabled" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "domains"
ADD COLUMN "in_app_browser_guide_copy_enabled" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "domains"
ADD COLUMN "in_app_browser_guide_message" TEXT;
