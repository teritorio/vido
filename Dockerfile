# syntax = docker/dockerfile:1

# Base
ARG NODE_VERSION=18.19.0

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /src

# Build
FROM base as build

COPY --link .yarn ./.yarn
COPY --link package.json yarn.lock .yarnrc.yml ./ 
RUN yarn install

COPY --link . .

RUN yarn build

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]
