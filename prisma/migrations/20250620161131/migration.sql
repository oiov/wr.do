INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_email_catch_all',
    'false',
    'BOOLEAN',
    '是否启用 Email Catch-all 功能'
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
    'catch_all_emails',
    '',
    'STRING',
    'Email Catchall 邮箱列表,逗号分隔'
);
