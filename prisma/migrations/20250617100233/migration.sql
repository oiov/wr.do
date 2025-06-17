-- AlterTable
ALTER TABLE "users" ADD COLUMN "password" TEXT;

INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_email_password_login',
    'true',
    'BOOLEAN',
    '是否启用邮箱密码登录'
);

INSERT INTO "users"
  (
  id,
  name,
  email,
  password,
  active,
  role,
  team
  )
VALUES
  (
    'cmadvu9w874j2sczhg174pftq',
    'admin',
    'admin@admin.com',
    '$2b$10$FQIPnvwTQ2dwL2F3SIiKDOf.qTvMcwfc0KsbqHQBWflpFT2o8Uwji',
    1,
    'ADMIN',
    'free'
);