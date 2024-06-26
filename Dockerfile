ARG NODE_VERSION
FROM node:${NODE_VERSION}

RUN apk --no-cache add git

# Create app directory
RUN mkdir -p /usr/src/app/.nuxt
WORKDIR /usr/src/app
RUN corepack enable

# Install app dependencies
COPY package.json yarn.lock .yarnrc.yml /usr/src/app/
RUN yarn install && yarn cache clean
COPY . /usr/src/app

ENV NODE_OPTIONS --openssl-legacy-provider
COPY vidos-config-empty.json vidos-config.json
COPY vidos.config.sample.ts vidos.config.ts
RUN yarn build

# Set environment variables
ENV NODE_ENV production
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]
