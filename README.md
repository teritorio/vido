# @teritorio/vido

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Release

```bash
$ git checkout develop
$ npm version minor -m "chore: release %s"
$ git push --follow-tags
```

Then, create a PR from `develop` to `main`, it will launch the continuous development.
