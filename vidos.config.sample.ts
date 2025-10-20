import type { VidosConfig } from '~/utils/types-config'

const configDefault = {
  IMAGE_PROXY: null,
}

const config: VidosConfig = {
  localhost: {
    HOSTS: ['localhost'],
    ...configDefault,
    API_PROJECT: 'dev',
    API_THEME: 'tourism',
  },
}

export default config
