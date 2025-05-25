FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN pnpm config set registry https://registry.npmmirror.com

COPY prisma ./prisma
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app

RUN npm install -g pnpm

ARG NEXT_PUBLIC_APP_URL="http://localhost:3000"
ARG RESEND_API_KEY="re_123"
ARG DATABASE_URL="postgres://postgres:postgres@postgres:5432/wrdo"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production
ENV IS_DOCKER=true

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]