import { VidosConfig } from '~/utils/types-config'

const configDefault = {
  API_SEARCH: 'https://search-dev.teritorio.xyz/search',
  API_SEARCH_ADDR: 'https://api-adresse.data.gouv.fr/search',
  API_EXPORT: 'https://print-dev.teritorio.xyz/v0.1',
  API_QR_SHORTENER: 'https://qr-shortener-dev.teritorio.xyz',
  BICYCLE_STYLE_URL:
    'https://vecto.teritorio.xyz/styles/teritorio-tourism-bicycle-0.9/style.json',
  IMAGE_PROXY: null,
  MAPILLARY_ACCESS_TOKEN: null,
  COOKIES_CONSENT: null,
  COOKIES_LINK: null,
  GOOGLE_TAG_MANAGER_ID: null,
  MATOMO_URL: null,
  MATOMO_SITEID: null,
}

const config: VidosConfig = {
  localhost: {
    HOSTS: ['localhost'],
    ...configDefault,
    API_ENDPOINT: 'https://cdt40.carto.guide/api.teritorio/geodata/v0.1',
    API_PROJECT: 'cdt40',
    API_THEME: 'tourism',
    VECTO_STYLE_URL:
      'https://merge-proxy-dev.teritorio.xyz/styles/teritorio-tourism-0.9/style.json?key=###',
    SATELLITE_STYLE_URL:
      'https://merge-proxy-dev.teritorio.xyz/styles/satellite-hybrid/style.json?key=###',
    BICYCLE_STYLE_URL:
      'https://merge-proxy-dev.teritorio.xyz/styles/teritorio-tourism-bicycle-0.9/style.json?key=###',
  },
}

export default config
