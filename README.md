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

* Main Map: `/`, `/{poi_Id}`, `/{category_ids}/` and `/{category_ids}/{poi_id}`.
* POI:
  * details: `/poi/{id}/details`.
* POIs:
  * map only: `/pois/{ids}/map`.

Full entry points documentation available on [api.yml](static/api.yaml) and on server at [http://localhost:3000/api.yaml](http://localhost:3000/api.yaml).

## Production configuration

Require server allows CORS on:
* `/api.yaml`: the swagger specification
Require server allows iframe usage on:
* `/pois/{ids}/map`: map intended to be used as iframe.

Apache2 configuration
```
  <Location "/api.yaml">
    Header set Access-Control-Allow-Origin "*"
  </Location>
  <LocationMatch "^/pois/.*/map$">
    Header set Content-Security-Policy "frame-ancestors *"
  </LocationMatch>
```

## Settings

Popup and details special fields support:
* `addr:*`: combined all address fields.
* `route:*`: all routes activity types and fields.
* `start_end_date`: combined `start_date` and `end_date` fields.

Spetial formatting support:
* `opening_hours`
* `phone` and `mobile`

## Users tracking

### Google Tag Manager optional tracking configuration

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
