INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    'enable_tg_email_push',
    'false',
    'BOOLEAN',
    '是否启用 Telegram 邮件推送'
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
    'tg_email_bot_token',
    '',
    'STRING',
    'Telegram 邮件推送 Bot Token'
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
    'tg_email_chat_id',
    '',
    'STRING',
    'Telegram 邮件推送 Chat ID'
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
    'tg_email_template',
    '',
    'STRING',
    'Telegram 邮件推送模板'
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
    'tg_email_target_white_list',
    '',
    'STRING',
    'Telegram 邮件推送目标白名单'
);

-- {
--   "enable_tg_email_push": true,
--   "tg_email_bot_token": "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
--   "tg_email_chat_id": "-1001234567890,-1001234567891,-1001234567892",
--   "tg_email_template": "📧 *New Email*\n\n*From:* {fromName}\n*Subject:* {subject}\n\n```\n{text}\n```",
--   "tg_email_target_white_list": "admin@example.com,support@example.com,notifications@example.com"
-- }

-- 多群组推送说明：
-- - tg_email_chat_id 支持多个 Chat ID，用逗号分隔
-- - 系统会并发推送到所有配置的群组/频道
-- - 单个群组推送失败不会影响其他群组
-- - 控制台会显示推送成功/失败统计

-- 白名单说明：
-- - 如果 tg_email_target_white_list 为空或未设置，则转发所有邮件到 Telegram
-- - 如果 tg_email_target_white_list 有值，则只转发发送到白名单中邮箱地址的邮件
-- - 白名单支持多个邮箱地址，用逗号分隔
-- - 邮箱地址匹配不区分大小写
-- */