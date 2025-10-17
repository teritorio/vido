import type { VidosConfig } from '~/utils/types-config'

const configDefault = {
  IMAGE_PROXY: null,
  ISOCHRONE: false,
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
    API_PROJECT: 'dev',
    API_THEME: 'tourism',
    VECTO_STYLE_URL: 'https://merge-proxy.teritorio.xyz/styles/teritorio-tourism-1.0/style.json?key=###',
    SATELLITE_STYLE_URL: 'https://merge-proxy.teritorio.xyz/styles/satellite-hybrid/style.json?key=###',
    BICYCLE_STYLE_URL: 'https://merge-proxy.teritorio.xyz/styles/teritorio-bicycle-tourism/style.json?key=###',
  },
}

export default config
