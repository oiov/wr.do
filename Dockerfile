FROM node:20-alpine AS base

# The MMDB is architecture-independent; download it on the native builder.
FROM --platform=$BUILDPLATFORM node:20-alpine AS geoip
WORKDIR /geoip
ARG GEOLITE2_NPM_VERSION=1.0.329
ARG GEOIP_NPM_REGISTRY=https://registry.npmjs.org
RUN set -eu; \
    archive="$(npm pack "@maxminddatabase/geolite2@${GEOLITE2_NPM_VERSION}" --registry="${GEOIP_NPM_REGISTRY}" --silent)"; \
    tar -xzf "${archive}" --strip-components=2 package/database/GeoLite2-City.mmdb; \
    test -s GeoLite2-City.mmdb

FROM base AS deps

RUN apk add --no-cache openssl
RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm install -g pnpm@9.15.9

COPY . .

# RUN pnpm config set registry https://registry.npmmirror.com

RUN pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app

RUN apk add --no-cache openssl

RUN npm install -g pnpm@9.15.9

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm test:auth && pnpm test:geo && pnpm run build

FROM base AS runner

WORKDIR /app

RUN apk add --no-cache openssl

RUN npm install -g pnpm@9.15.9

ENV NODE_ENV=production
ENV IS_DOCKER=true

RUN pnpm add npm-run-all dotenv prisma@5.22.0 @prisma/client@5.22.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=geoip /geoip/GeoLite2-City.mmdb /app/geoip/GeoLite2-City.mmdb

# Check db
COPY scripts/check-db.js /app/scripts/check-db.js
COPY scripts/bootstrap-admin.js /app/scripts/bootstrap-admin.js

EXPOSE 3000

ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# CMD ["node", "server.js"]
CMD ["pnpm", "start-docker"]
