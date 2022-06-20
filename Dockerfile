FROM node:14-alpine3.16

# Create app directory
RUN mkdir -p /usr/src/app/.nuxt
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn install
COPY . /usr/src/app
RUN yarn install
RUN yarn build

# Set environment variables
ENV NODE_ENV production
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

EXPOSE 3000
CMD [ "yarn", "start" ]
