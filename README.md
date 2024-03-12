# @teritorio/vido

Vido is a web map application for browsing POIs organized in categories. The main features are:
- a slippy map
- a POI categories menu
- a full POIs browsing mode
- POI favorites and notebook
- page for each POI content
- list a POI be categories

Vido is the frontend for the [data API](https://dev.appcarto.teritorio.xyz/content/wp-content/plugins/ApiTeritorio/vendor/swagger-api/swagger-ui/dist/?url=https://dev.appcarto.teritorio.xyz//content/wp-content/plugins/ApiTeritorio/swagger-doc.yaml).

Vido use aside projects to:
- export list of POIs as PDF: [https://github.com/teritorio/elasa-export](https://github.com/teritorio/elasa-export)
- search for POIs: [elasa-search](https://github.com/teritorio/elasa-search)
- produce QR Code: [qr-shortener](https://github.com/teritorio/qr-shortener)

The web application target multiple devices: smartphones, desktops, and large touchscreens.

![Vido main map](Vido-main-map.webp)

## Entry points

### Web
Full entry points documentation available on [api.yml](public/api.yaml) and on server at [http://localhost:3000/api.yaml](http://localhost:3000/api.yaml).

* Main Map:
  * Full page: `/`, `/{poi_Id}`, `/{category_ids}/` and `/{category_ids}/{poi_id}`.
  * Parameters:
    * `boundary`: an alternative boundary key from settings `polygons_extra`.
* Embedded: `/embedded/`, same subpath and parameters as full page.
* POI:
  * details: `/poi/{id}/details`.
* POIs:
  * map only: `/pois/{ids}/map`.
* Categories
  * list of POIs of a category: `/category/{id}`

### Sitemap & WPA
* `/manifest.webmanifest`
* `/sitemap.xml`

## Setup

Can be build directly (dev) or within Docker.

### Native Build Setup

**Prerequisite**

- Node >= 18.0.0 < 20.0.0

```bash
# install dependencies
yarn install

# Generate fixtures
yarn build-fixture

# Prepare
yarn prepare

# Generate configuration from `vidos.config.ts`
yarn build-config

# serve with hot reload at localhost:3000
yarn dev

# build for production and launch server
yarn build
yarn start
```

### Setup with Docker
```
cp .env.sample .env
docker-compose build
docker-compose -f docker-compose.yml run --rm vido yarn build-config
docker-compose up -d
```

### Production configuration
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

## Dev

![data flow](doc/data-flow.svg)

Vido is mainly building using:
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/map/)
- [Nxut3](https://nuxt.com/) and [Vue3](https://vuejs.org/), using the Options API

```
# serve with hot reload at localhost:3000
yarn dev
```

### Dev with Historie, components stories
Run Historie with
```
yarn start:historie
```

Historie build also available on `gh-pages` branch built by CI and online at https://teritorio.github.io/vido/

### Tests
Run end to end tests with dev server or build:
```
# With dev
yarn dev

# The run Histoire component screenshot regression tests
yarn test:histoire

# The run end to end tests
yarn test:cypress
```

## Release

```bash
$ git checkout develop
$ npm version minor -m "chore: release %s"
$ git push --follow-tags
```

Then, create a PR from `develop` to `main`, it will launch the continuous development.

### Internals

## Details fields configurations

Popup and details special fields support:
* `addr:*`: combined all address fields.
* `route:*`: all routes activity types and fields.
* `start_end_date`: combined `start_date` and `end_date` fields.
* `short_description`

Special formatting support:
* `opening_hours`
* `phone` and `mobile`

## Users tracking

| Event | Vido event | Vido actions | Google event | Google params | Matomo | Matomo params |
|----------------------------------|---------------------|---------------------------------------------|---------------------|------------------------------------------|-----------------|----------------------------------|
| Page loading (homepage, details) | page | | pageview | pageTitle, pageLocation, pagePath | trackPageView | title, Url, Origin |
| Navigation on a menu item | menu | | pageview | pageTitle, pagePath | trackPageView | title, Url |
| Enable or disable a category | category_event | enable, filter | category_event | action, categoryId | trackEvent | event, action, title, categoryId |
| Focus on the search area | search | | pageview | pageTitle, pagePath | trackPageView | title, Url |
| Seach query | search_query | | | | trackSiteSearch | query |
| Selecting a search result | search_result_event | | search_result_event | type, title | trackEvent | event, action, title, resultType |
| Opening the popup | popup | | pageview | pageTitle, pageLocation, pagePath, poiId | trackPageView | title, Url |
| Action on the popup | popup_event | details, route, explore, favorite, zoom | popup_event | action, title, poiId, category | trackEvent | event, action, title, poiId |
| Action on the map control | map_control_event | 3d, background, explorer, favorite | map_control_event | action | trackEvent | event, action |
| Action on favorites | favorites_event | open_share, copy_link, exportPDF, exportCSV | favorites_event | action | trackEvent | event, action |
| Notebook | notebook_event | open | pageview | pageTitle, pagePath | trackPageView | title, Url |
| External links | external_link | | external_link | Url, title | trackLink | Url |
| Action on details page | details_event | favorite | details_event | action, title, poiId | trackEvent | event, action, title, poiId |

Note on Matomo. `Origin` is a set as dimension `1` and should be configured as is on Matomo.

## Contributor Mode
Enable/Disable: Add the following query parameter in the URL: `?contrib=true|false`
