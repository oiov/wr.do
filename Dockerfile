# 基础镜像 - 使用 Node.js 20
FROM node:20-alpine AS base

# 安装系统依赖
RUN apk add --no-cache openssl libc6-compat

# 设置工作目录
WORKDIR /app

# 全局安装 pnpm
RUN npm install -g pnpm

# 依赖安装阶段
FROM base AS deps

# 复制依赖配置文件（优化缓存层次）
COPY package.json pnpm-lock.yaml ./

# 复制 prisma目录
COPY prisma ./

# 配置 pnpm store 目录
RUN --mount=type=cache,target=/root/.pnpm-store pnpm config set store-dir /root/.pnpm-store

# 使用缓存挂载安装依赖
RUN --mount=type=cache,target=/root/.pnpm-store --mount=type=cache,target=/app/node_modules/.cache pnpm install --frozen-lockfile --prefer-offline

# 构建阶段
FROM base AS builder

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制配置文件（优先复制，利用缓存）
COPY package.json pnpm-lock.yaml ./
COPY next.config.mjs ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.js ./
COPY components.json ./
COPY contentlayer.config.ts ./
COPY next-sitemap.config.js ./
COPY prettier.config.js ./
COPY env.mjs ./
COPY middleware.ts ./
COPY auth.config.ts ./
COPY auth.ts ./

# 复制源代码目录
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY hooks ./hooks
COPY config ./config
COPY types ./types
COPY actions ./actions
COPY styles ./styles
COPY i18n ./i18n
COPY locales ./locales
COPY content ./content

# 复制资源文件
COPY public ./public
COPY prisma ./prisma
COPY scripts ./scripts

# 复制环境变量示例
COPY .env.example ./

# 使用缓存挂载构建应用
RUN --mount=type=cache,target=/app/.next/cache pnpm run build

# 运行时阶段
FROM base AS runner

# 创建系统用户组
RUN addgroup --system --gid 1001 nodejs

# 创建系统用户
RUN adduser --system --uid 1001 nextjs

# 设置环境变量
ENV NODE_ENV=production
ENV IS_DOCKER=true
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# 配置 pnpm store 目录
RUN --mount=type=cache,target=/root/.pnpm-store pnpm config set store-dir /root/.pnpm-store

# 使用缓存挂载安装运行时依赖
RUN --mount=type=cache,target=/root/.pnpm-store pnpm add npm-run-all dotenv prisma@5.17.0 @prisma/client@5.17.0

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# 复制 Next.js 构建输出（利用输出跟踪减少镜像大小）
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制数据库检查脚本
COPY --chown=nextjs:nodejs scripts/check-db.js /app/scripts/check-db.js

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["pnpm", "start-docker"]
