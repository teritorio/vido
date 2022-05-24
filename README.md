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

## Dev with Storybook

Run Storybook with
```
yarn start:storybook
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

| Event                        | Vido event          | Vido actions                            | Google event        | Google params                            | Matomo          | Matomo params                    |
|------------------------------|---------------------|-----------------------------------------|---------------------|------------------------------------------|-----------------|----------------------------------|
| HomePage loading             | page                |                                         | pageview            | pageTitle, pageLocation, pagePath        | trackPageView   | SetCustomTtitle, setCustomUrl    |
| Consultation of a category   | category            |                                         | pageview            | pageTitle, pagePath                      | trackPageView   | SetCustomTtitle, setCustomUrl    |
| Enable or disable a category | category_event      | enable, filter                          | category_event      | action, categoryId                       | trackEvent      | event, action, title, categoryId |
| Focus on the search area     | search              |                                         | pageview            | pageTitle, pagePath                      | trackPageView   | SetCustomTtitle, setCustomUrl    |
| Seach query                  | search_query        |                                         |                     |                                          | trackSiteSearch | query                            |
| Selecting a search result    | search_result_event |                                         | search_result_event | type, title                              | trackEvent      | event, action, title, resultType |
| Opening the popup            | popup               |                                         | pageview            | pageTitle, pageLocation, pagePath, poiId | trackPageView   | SetCustomTtitle, setCustomUrl    |
| Action on the popup          | popup_event         | details, route, explore, favorite, zoom | popup_event         | action, title, poiId, category           | trackEvent      | event, action, title, poiId      |
| Action on the map control    | map_control_event   | 3d, background, explorer, favorite      | map_control_event   | action                                   | trackEvent      | event, action                    |
| Action on favorites          | favorites_event     | copy_link, exportPDF, exportCSV         | favorites_event     | action                                   | trackEvent      | event, action                    |
| Notebook                     | notebook_event      | open                                    | pageview            | pageTitle, pagePath                      | trackPageView   | SetCustomTtitle, setCustomUrl    |
| External links               | external_link       |                                         | external_link       | Url, title                               | trackLink       | Url                              |
