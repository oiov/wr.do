-- CF R2 配置
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    's3_config_01',
    '{"enabled":true,"platform":"cloudflare","channel":"r2","provider_name":"Cloudflare R2","account_id":"","access_key_id":"","secret_access_key":"","endpoint":"https://<account_id>.r2.cloudflarestorage.com","buckets":[{"bucket":"","prefix":"","file_types":"","region":"auto","custom_domain":"","file_size":"26214400","public":true}]}',
    'OBJECT',
    'R2 存储桶配置'
);

-- AWS S3 配置
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    's3_config_02',
    '{"enabled":true,"platform":"aws","channel":"s3","provider_name":"Amazon S3","endpoint":"https://s3.<region>.amazonaws.com","account_id":"","access_key_id":"","secret_access_key":"","buckets":[{"custom_domain":"","prefix":"","bucket":"","file_types":"","file_size":"26214400","region":"us-east-1","public":true}]}',
    'OBJECT',
    'Amazon S3 存储桶配置'
);

-- 阿里云 OSS 配置  
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    's3_config_03',
    '{"enabled":true,"platform":"ali","channel":"oss","provider_name":"阿里云 OSS","endpoint":"","account_id":"","access_key_id":"","secret_access_key":"","buckets":[{"custom_domain":"","prefix":"","bucket":"","file_types":"","file_size":"26214400","region":"","public":true}]}',
    'OBJECT',
    '阿里云 OSS 存储桶配置'
);

-- 腾讯云 COS 配置
INSERT INTO "system_configs"
  (
  "key",
  "value",
  "type",
  "description"
  )
VALUES
  (
    's3_config_04',
    '{"enabled":true,"platform":"tencent","channel":"cos","provider_name":"腾讯云 COS","endpoint":"","account_id":"","access_key_id":"","secret_access_key":"","buckets":[{"custom_domain":"","prefix":"","bucket":"","file_types":"","file_size":"26214400","region":"","public":true}]}',
    'OBJECT',
    '腾讯云 COS 存储桶配置'
);