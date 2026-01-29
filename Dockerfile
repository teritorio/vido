ARG NODE_VERSION=20-alpine3.18
FROM node:${NODE_VERSION}

# Sentry build args for sourcemap upload
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}

RUN apk --no-cache add git ruby

# Create app directory
RUN mkdir -p /usr/src/app/.nuxt
WORKDIR /usr/src/app
RUN corepack enable

# Install app dependencies
COPY package.json yarn.lock .yarnrc.yml /usr/src/app/
RUN yarn install && yarn cache clean
COPY . /usr/src/app
RUN yarn build-fixture

ENV NODE_OPTIONS="--openssl-legacy-provider"
RUN yarn build

# Set environment variables
ENV NODE_ENV="production"
ENV NUXT_HOST="0.0.0.0"
ENV NUXT_PORT="3000"

EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]

HEALTHCHECK \
    --start-interval=1s \
    --start-period=30s \
    --interval=30s \
    --timeout=20s \
    --retries=5 \
    CMD wget --no-verbose --tries=1 -O /dev/null http://localhost:3000/up || exit 1
