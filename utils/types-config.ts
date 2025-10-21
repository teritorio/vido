export interface VidoConfig {
  HOSTS: string[]
  API_PROJECT: string
  API_THEME: string
}

export interface VidosConfig {
  [key: string]: VidoConfig
}
