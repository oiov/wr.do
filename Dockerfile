FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN pnpm config set registry https://registry.npmmirror.com

COPY prisma ./prisma
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app

RUN npm install -g pnpm

ARG DATABASE_URL=""
ARG AUTH_SECRET=""
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG GOOGLE_CLIENT_ID=""
ARG GOOGLE_CLIENT_SECRET=""
ARG GITHUB_ID=""
ARG GITHUB_SECRET=""
ARG LinuxDo_CLIENT_ID=""
ARG LinuxDo_CLIENT_SECRET=""
ARG RESEND_API_KEY="res"
ARG NEXT_PUBLIC_EMAIL_R2_DOMAIN=""
ARG NEXT_PUBLIC_OPEN_SIGNUP="1"
ARG NEXT_PUBLIC_GOOGLE_ID=""
ARG SCREENSHOTONE_BASE_URL=""
ARG GITHUB_TOKEN="ghp_"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production
ENV IS_DOCKER=true

# 复制必要文件
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]