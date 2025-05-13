import { addLayout, createResolver, defineNuxtModule, extendPages } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'vido-config-ui',
    configKey: 'vidoConfigUI',
    version: '1.0.0',
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      // eslint-disable-next-line no-console
      console.info('[@teritorio/vido-config-ui] Skipped - only enabled in development mode.')
      return
    }

    const { resolve } = createResolver(import.meta.url)

    addLayout({
      src: resolve('layouts/vido-config-ui.vue'),
      filename: 'vido-config-ui.vue',
      write: true,
    }, 'vido-config-ui')

    extendPages((pages) => {
      pages.unshift({
        name: 'vido-config-ui',
        path: '/config',
        file: resolve('pages/vido-config-ui.vue'),
      })
    })

    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: resolve('components'),
        prefix: 'VidoConfig', // use <VidoConfigInstanceCard />
      })
    })
  },
})
