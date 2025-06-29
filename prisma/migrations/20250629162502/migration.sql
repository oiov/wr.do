-- 是否开启邮件推送（子域名申请状态）
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_subdomain_status_email_pusher',
    'false',
    'BOOLEAN',
    '是否开启邮件推送（子域名申请状态）'
);

-- Catch-all 白名单邮箱
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'catch_all_whitelist_emails',
    '',
    'STRING',
    'Catch-all 白名单邮箱'
);

