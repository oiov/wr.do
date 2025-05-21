-- CreateEnum
CREATE TYPE "UserRole" AS ENUM
('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "accounts"
(
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions"
(
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"
(
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "active" INTEGER NOT NULL DEFAULT 1,
    "team" TEXT NOT NULL DEFAULT 'free',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens"
(
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "user_records"
(
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "zone_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "proxiable" BOOLEAN,
    "proxied" BOOLEAN,
    "ttl" INTEGER,
    "comment" TEXT,
    "tags" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_records_userId_idx" ON "user_records" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_records_record_id_key" ON "user_records"("record_id");

-- AddForeignKey
ALTER TABLE "user_records" ADD CONSTRAINT "user_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "user_urls"
(
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "visible" INTEGER NOT NULL DEFAULT 0,
    "active" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_urls_userId_idx" ON "user_urls" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_urls_url_key" ON "user_urls"("url");

-- AddForeignKey
ALTER TABLE "user_urls" ADD CONSTRAINT "user_urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "url_metas"
(
    "id" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "click" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "url_metas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "url_metas_urlId_idx" ON "url_metas" ("urlId");

-- AddForeignKey
ALTER TABLE "url_metas" ADD CONSTRAINT "url_metas_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "user_urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "url_metas" ADD COLUMN "ip" TEXT NOT NULL;

ALTER TABLE "url_metas" ADD CONSTRAINT "unique_urlId_ip" UNIQUE ("urlId", "ip");

ALTER TABLE "url_metas" ADD COLUMN "city" TEXT;
ALTER TABLE "url_metas" ADD COLUMN "country" TEXT;
ALTER TABLE "url_metas" ADD COLUMN "region" TEXT;
ALTER TABLE "url_metas" ADD COLUMN "latitude" TEXT;
ALTER TABLE "url_metas" ADD COLUMN "longitude" TEXT;
ALTER TABLE "url_metas" ADD COLUMN "referer" TEXT;
ALTER TABLE "url_metas" ADD COLUMN "lang" TEXT;
ALTER TABLE "url_metas" ADD COLUMN "device" TEXT;
ALTER TABLE "url_metas" ADD COLUMN "browser" TEXT;

ALTER TABLE "user_urls" ADD COLUMN "expiration" TEXT NOT NULL DEFAULT '-1';

ALTER TABLE "users" ADD COLUMN "apiKey" TEXT;

-- CreateTable
CREATE TABLE "scrape_metas"
(
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "click" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '127.0.0.1',
    "city" TEXT,
    "country" TEXT,
    "region" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "referer" TEXT,
    "lang" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "link" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scrape_metas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scrape_metas_userId_type_apiKey_idx" ON "scrape_metas" ("userId", "type", "apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "scrape_metas_type_ip_link_key" ON "scrape_metas" ("type", "ip", "link");

-- AddForeignKey
ALTER TABLE "scrape_metas" ADD CONSTRAINT "scrape_metas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


CREATE TABLE "forward_emails"
(
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT DEFAULT 'No Subject',
    "text" TEXT DEFAULT '',
    "html" TEXT DEFAULT '',
    "date" TEXT DEFAULT '',
    "messageId" TEXT DEFAULT '',
    "replyTo" TEXT DEFAULT '',
    "cc" TEXT DEFAULT '[]',
    "headers" TEXT DEFAULT '[]',
    "attachments" TEXT DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forward_emails_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "forward_emails" ADD COLUMN "readAt" TIMESTAMP;

CREATE TABLE "user_emails"
(
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_emails_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "user_emails" ADD COLUMN "deletedAt" TIMESTAMP
(3);

ALTER TABLE "forward_emails"
ADD CONSTRAINT "forward_emails_to_fkey" 
FOREIGN KEY ("to") 
REFERENCES "user_emails" ("emailAddress") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

ALTER TABLE "user_urls" ADD COLUMN "password" TEXT NOT NULL DEFAULT '';

CREATE TABLE "user_send_emails"
(
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "fromName" TEXT DEFAULT '',
    "to" TEXT NOT NULL,
    "subject" TEXT DEFAULT 'No Subject',
    "text" TEXT DEFAULT '',
    "html" TEXT DEFAULT '',
    "replyTo" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "user_send_emails_userId_idx" ON "user_send_emails" ("userId");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "user_records_created_on_idx" ON "user_records"("created_on");

-- CreateIndex
CREATE INDEX "user_urls_createdAt_idx" ON "user_urls"("created_at");

-- CreateIndex
CREATE INDEX "user_emails_createdAt_idx" ON "user_emails"("createdAt");

-- CreateIndex
CREATE INDEX "forward_emails_createdAt_idx" ON "forward_emails"("createdAt");