export interface VidoConfig {
  HOSTS: string[]
  API_PROJECT: string
  API_THEME: string
  VECTO_STYLE_URL: string
  SATELLITE_STYLE_URL: string
  BICYCLE_STYLE_URL: string
  IMAGE_PROXY: string[] | null
  ISOCHRONE: boolean
  COOKIES_CONSENT: string | null
  COOKIES_LINK: string | null
  GOOGLE_SITE_VERIFICATION: string | undefined
  GOOGLE_TAG_MANAGER_ID: string | null
  MATOMO_URL: string | null
  MATOMO_SITEID: string | null
}

export interface VidosConfig {
  [key: string]: VidoConfig
}
