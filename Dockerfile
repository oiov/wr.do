FROM node:20-alpine AS base

FROM base AS deps

RUN apk add --no-cache openssl
RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm install -g pnpm

COPY . .

# RUN pnpm config set registry https://registry.npmmirror.com

RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app

RUN apk add --no-cache openssl

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

FROM base AS runner

WORKDIR /app

RUN apk add --no-cache openssl

RUN npm install -g pnpm

ENV NODE_ENV=production
ENV IS_DOCKER=true

RUN pnpm add npm-run-all dotenv prisma@5.17.0 @prisma/client@5.17.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Check db
COPY scripts/check-db.js /app/scripts/check-db.js

EXPOSE 3000

ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# CMD ["node", "server.js"]
CMD ["pnpm", "start-docker"]