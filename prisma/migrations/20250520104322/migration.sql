CREATE TABLE domains
(
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "domain_name" TEXT NOT NULL UNIQUE,
  "enable_short_link" BOOLEAN DEFAULT FALSE,
  "enable_email" BOOLEAN DEFAULT FALSE,
  "enable_dns" BOOLEAN DEFAULT FALSE,
  "cf_zone_id" TEXT NOT NULL,
  "cf_api_key" TEXT NOT NULL,
  "cf_email" TEXT NOT NULL,
  "cf_api_key_encrypted" BOOLEAN DEFAULT FALSE,
  "max_short_links" INTEGER,
  "max_email_forwards" INTEGER,
  "max_dns_records" INTEGER,
  "active" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);