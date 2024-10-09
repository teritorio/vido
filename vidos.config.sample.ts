import type { VidosConfig } from '~/utils/types-config'

const configDefault = {
  API_SEARCH: 'https://search-dev.teritorio.xyz/search',
  API_ADDR: 'https://api-adresse.data.gouv.fr',
  API_EXPORT: 'https://print-dev.teritorio.xyz/v0.1',
  API_QR_SHORTENER: 'https://qr-shortener-dev.teritorio.xyz',
  IMAGE_PROXY: null,
  MAPILLARY_ACCESS_TOKEN: null,
  OPEN_ROUTE_SERVICE_KEY: null,
  SENTRY_DSN: null,
  COOKIES_CONSENT: null,
  COOKIES_LINK: null,
  GOOGLE_SITE_VERIFICATION: undefined,
  GOOGLE_TAG_MANAGER_ID: null,
  MATOMO_URL: null,
  MATOMO_SITEID: null,
}

const config: VidosConfig = {
  localhost: {
    HOSTS: ['localhost'],
    ...configDefault,
    API_ENDPOINT: 'https://dev.appcarto.teritorio.xyz/content/api.teritorio/geodata/v0.1',
    API_PROJECT: 'dev',
    API_THEME: 'tourism',
    VECTO_STYLE_URL: 'https://merge-proxy.teritorio.xyz/styles/teritorio-tourism-1.0/style.json?key=###',
    SATELLITE_STYLE_URL: 'https://merge-proxy.teritorio.xyz/styles/satellite-hybrid/style.json?key=###',
    BICYCLE_STYLE_URL: 'https://merge-proxy.teritorio.xyz/styles/teritorio-bicycle-tourism/style.json?key=###',
  },
}

export default config
