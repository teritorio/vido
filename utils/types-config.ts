export interface VidoConfig {
  API_SEARCH: string
  API_SEARCH_ADDR: string
  API_EXPORT: string
  API_QR_SHORTENER: string
  API_ENDPOINT: string
  API_PROJECT: string
  API_THEME: string
  VECTO_STYLE_URL: string
  SATELLITE_STYLE_URL: string
  RASTER_STYLE_URL: string
  MAPILLARY_ACCESS_TOKEN: string | null
  GOOGLE_TAG_MANAGER_ID: string | null
  MATOMO_URL: string | null
  MATOMO_SITEID: string | null
}

export interface VidosConfig {
  [key: string]: VidoConfig
}
