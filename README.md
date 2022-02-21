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

## Entry points

* Main Map: `/`
* POI details: `/poi/{id}/details`
* POI on map only: `/poi/{id}/map`

## Users tracking

## Google Tag Manager optional tracking configuration

|                                | event               | pageType | pageTitle | pageLocation | pagePath | action                                  | type | title | poiId | category | categoryId |
| ------------------------------ | ------------------- | -------- | --------- | ------------ | -------- | --------------------------------------- | ---- | ----- | ----- | -------- | ---------- |
| Loading a page (HomePage only) | pageview            | PageView | x         | x            | x        |                                         |      |       |       |          |            |
| Consultation of a category     | pageview            | PageView | x         |              | x        |                                         |      |       |       |          |            |
| Enable or disable a category   | category_event      |          |           |              |          | enable, filter                          |      |       |       |          | x          |
| Focus on the search area       | pageview            | PageView | x         |              | x        |                                         |      |       |       |          |            |
| Selecting a search result      | search_result_event |          |           |              |          |                                         | x    | x     |       |          |            |
| Opening the popup              | pageview            | PageView | x         | x            | x        |                                         |      |       | x     |          |            |
| Action on the popup            | popup_event         |          |           |              |          | details, route, explore, favorite, zoom |      | x     | x     | x        |            |
| Action on the map control      | map_control_event   |          |           |              |          | 3d, background, explorer, favorite      |      |       |       |          |            |
| Action on favorites            | favorites_event     |          |           |              |          | copy_link                               |      |       |       |          |            |
