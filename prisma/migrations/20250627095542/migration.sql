-- 邮件注册后缀限制
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_email_registration_suffix_limit',
    'false',
    'BOOLEAN',
    '是否启用邮件注册后缀限制'
);

-- 邮件后缀限制白名单
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'email_registration_suffix_limit_white_list',
    '',
    'STRING',
    '邮件后缀限制白名单'
);