FROM node:22-alpine AS base

FROM base AS deps

RUN apk update && apk upgrade
RUN apk add --no-cache openssl3-compat
RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm install -g pnpm

# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc*  ./
# 复制根目录下的所有文件
COPY . .

RUN pnpm config set registry https://registry.npmmirror.com

COPY prisma ./prisma
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm i --frozen-lockfile

# RUN pnpm postinstall

FROM base AS builder
WORKDIR /app

RUN npm install -g pnpm

ARG NEXT_PUBLIC_APP_URL="http://localhost:3000"
ARG RESEND_API_KEY="re_your_resend_api_key"
ARG DATABASE_URL="postgres://postgres:postgres@postgres:5432/wrdo"

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV DATABASE_URL=$DATABASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production
ENV IS_DOCKER=true

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]