INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_email_forward',
    'false',
    'BOOLEAN',
    '是否开启邮件转发'
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
    'email_forward_targets',
    '',
    'STRING',
    '邮件转发目标,以逗号分隔'
);

