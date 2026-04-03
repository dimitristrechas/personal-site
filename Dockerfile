# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apt-get update -qq && apt-get install --no-install-recommends -y ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS builder
RUN apt-get update -qq && apt-get install --no-install-recommends -y ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SITE_DOMAIN
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_SITE_DOMAIN=${NEXT_PUBLIC_SITE_DOMAIN}

RUN --mount=type=secret,id=ghost_url \
  --mount=type=secret,id=ghost_content_api_key \
  GHOST_URL="$(cat /run/secrets/ghost_url)" \
  GHOST_CONTENT_API_KEY="$(cat /run/secrets/ghost_content_api_key)" \
  yarn build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update -qq && apt-get install --no-install-recommends -y ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/',(r)=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
