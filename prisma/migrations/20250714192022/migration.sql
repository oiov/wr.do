-- S3 配置
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    's3_config_list',
    '[{"enabled":true,"platform":"cloudflare","channel":"r2","provider_name":"Cloudflare R2","account_id":"","access_key_id":"","secret_access_key":"","endpoint":"https://<account_id>.r2.cloudflarestorage.com","buckets":[{"bucket":"","prefix":"","file_types":"","region":"auto","custom_domain":"","file_size":"26214400","public":true}]},{"enabled":false,"platform":"tencent","channel":"cos","provider_name":"腾讯云 COS","endpoint":"","account_id":"","access_key_id":"","secret_access_key":"","buckets":[{"custom_domain":"","prefix":"","bucket":"","file_types":"","file_size":"26214400","region":"","public":true}]}]',
    'OBJECT',
    'R2 存储桶配置'
);