import { vidoConfig } from '~/plugins/vido-config'
import type { VidoConfig } from '~/utils/types-config'

export default defineNuxtPlugin(async (nuxtApp) => {
  let config = null

  try {
    const response: VidoConfig = vidoConfig(useRequestHeaders())
    config = response
  }
  catch (error) {
    console.error('Failed to fetch configuration', error)
  }

  nuxtApp.payload.data = {
    ...nuxtApp.payload.data,
    configuration: config,
  }
})
