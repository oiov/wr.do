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
    'c0025ebe2edf525367e859821ccac33a:95992aad7ca8dc7c51855859f7adaa6282b09439b3e138fde22aeeaa6864af0f43fdd297cc7409b24a011300c038ff4d7585f89019e7629120123ec947f62b15',
    1,
    'ADMIN',
    'free'
);