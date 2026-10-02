# syntax=docker/dockerfile:1

FROM node:24.12.0-bookworm-slim AS base

WORKDIR /app
RUN corepack enable

FROM base AS build-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM build-deps AS build
COPY . .
ARG PUBLIC_SITE_URL
ARG PUBLIC_HCAPTCHA_SITE_KEY
ARG UMAMI_URL=https://analytics.daliborhon.dev
ARG UMAMI_SITE_ID=7e04370d-ecba-4fd8-8d71-2d50880d0d59
ARG PREVIEW=false
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}
ENV PUBLIC_HCAPTCHA_SITE_KEY=${PUBLIC_HCAPTCHA_SITE_KEY}
ENV UMAMI_URL=${UMAMI_URL}
ENV UMAMI_SITE_ID=${UMAMI_SITE_ID}
ENV PREVIEW=${PREVIEW}
# Coolify skips automatic secret injection for RUN commands that already have mounts.
# Mount public build variables here too; ARG values still work for local builds.
RUN --mount=type=secret,id=GITHUB_TOKEN,env=GITHUB_TOKEN,required=true \
    --mount=type=secret,id=PUBLIC_SITE_URL,env=PUBLIC_SITE_URL \
    --mount=type=secret,id=PUBLIC_HCAPTCHA_SITE_KEY,env=PUBLIC_HCAPTCHA_SITE_KEY \
    --mount=type=secret,id=UMAMI_URL,env=UMAMI_URL \
    --mount=type=secret,id=UMAMI_SITE_ID,env=UMAMI_SITE_ID \
    --mount=type=secret,id=PREVIEW,env=PREVIEW \
    pnpm build

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

FROM node:24.12.0-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./package.json
RUN chown node:node /app

USER node
EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "./dist/server/entry.mjs"]
