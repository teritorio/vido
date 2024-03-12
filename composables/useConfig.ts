import { siteStore as useSiteStore } from '~/stores/site'
import { vidoConfig } from '~/plugins/vido-config'
import type { VidoConfig } from '~/utils/types-config'

export default function () {
  const siteStore = useSiteStore()
  const { $vidoConfigSet } = useNuxtApp()

  function fetchConfig(): VidoConfig {
    let config = siteStore.config

    if (process.server && !config) {
      config = vidoConfig(useRequestHeaders())
      $vidoConfigSet(config)
      siteStore.$patch({ config })
    }

    if (!config)
      throw createError({ statusCode: 404, statusMessage: 'Wrong config', fatal: true })

    return config
  }

  return {
    fetchConfig,
  }
}
