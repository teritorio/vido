export interface VidoConfig {
  HOSTS: string[]
  API_PROJECT: string
  API_THEME: string
  IMAGE_PROXY: string[] | null
}

export interface VidosConfig {
  [key: string]: VidoConfig
}
