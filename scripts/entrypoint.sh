#!/bin/sh
# scripts/entrypoint.sh

# 数据库初始化

retries=3 # 重试次数
count=0
echo "Running database initialization..."
until pnpm db:push || [ $count -ge $retries ]; do
    echo "Database initialization failed, retrying ($((count + 1))/$retries)..."
    count=$((count + 1))
    sleep 5
done

# 检查是否成功
if [ $count -ge $retries ]; then
    echo "Database initialization failed after $retries attempts."
    exit 1
fi

echo "Database initialization successful."

# 执行原始的启动命令
echo "Starting the application..."
exec "$@"