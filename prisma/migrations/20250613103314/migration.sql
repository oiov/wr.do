ALTER TABLE "domains" ADD COLUMN "cf_record_types" TEXT NOT NULL DEFAULT 'CNAME,A,TXT';

INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_github_oauth',
    'true',
    'BOOLEAN',
    '是否启用 GitHub OAuth 登录'
);

INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_google_oauth',
    'true',
    'BOOLEAN',
    '是否启用 Google OAuth 登录'
);

INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_liunxdo_oauth',
    'true',
    'BOOLEAN',
    '是否启用 LiunxDo OAuth 登录'
);

INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_resend_email_login',
    'true',
    'BOOLEAN',
    '是否启用 Resend 邮箱登录'
);