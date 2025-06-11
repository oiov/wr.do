CREATE TABLE "system_configs"
(
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT,
  "version" TEXT NOT NULL DEFAULT '0.5.0',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 1. 是否开启注册配置
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_user_registration',
    'true',
    'BOOLEAN',
    '是否允许新用户注册'
);

-- 2. 系统通知配置  
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'system_notification',
    '',
    'STRING',
    '系统全局通知消息'
);

-- 3. 是否子域名申请模式，默认false
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_subdomain_apply',
    'false',
    'BOOLEAN',
    '是否启用子域名申请模式'
);

-- 创建计划表
CREATE TABLE "plans"
(
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slTrackedClicks" INTEGER NOT NULL,
  "slNewLinks" INTEGER NOT NULL,
  "slAnalyticsRetention" INTEGER NOT NULL,
  "slDomains" INTEGER NOT NULL,
  "slAdvancedAnalytics" BOOLEAN NOT NULL,
  "slCustomQrCodeLogo" BOOLEAN NOT NULL,
  "rcNewRecords" INTEGER NOT NULL,
  "emEmailAddresses" INTEGER NOT NULL,
  "emDomains" INTEGER NOT NULL,
  "emSendEmails" INTEGER NOT NULL,
  "appSupport" TEXT NOT NULL,
  "appApiAccess" BOOLEAN NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建唯一索引
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");

-- 插入初始数据
INSERT INTO "plans"
  (
  "id",
  "name",
  "slTrackedClicks",
  "slNewLinks",
  "slAnalyticsRetention",
  "slDomains",
  "slAdvancedAnalytics",
  "slCustomQrCodeLogo",
  "rcNewRecords",
  "emEmailAddresses",
  "emDomains",
  "emSendEmails",
  "appSupport",
  "appApiAccess"
  )
VALUES
  (
    '45fc1184-f7e7-4768-b28d-3f6e73d5a766',
    'free',
    100000,
    1000,
    180,
    2,
    true,
    false,
    3,
    1000,
    2,
    200,
    'BASIC',
    true
),
  (
    '45fc1184-f7e7-4768-b28f-3e6e73d5a769',
    'premium',
    1000000,
    5000,
    365,
    2,
    true,
    true,
    2,
    5000,
    2,
    1000,
    'LIVE',
    true
),
  (
    '45fc1184-f7e7-4768-b28d-3f6e73d5a678',
    'business',
    10000000,
    10000,
    1000,
    2,
    true,
    true,
    10,
    10000,
    2,
    2000,
    'LIVE',
    true
);