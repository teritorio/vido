ARG NODE_VERSION=20-alpine3.18
FROM node:${NODE_VERSION}

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
COPY vidos-config-empty.json vidos-config.json
COPY vidos.config.sample.ts vidos.config.ts
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
