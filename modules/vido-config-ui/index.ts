import {
  addComponentsDir,
  addLayout,
  createResolver,
  defineNuxtModule,
  extendPages,
} from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@teritorio/vido-config-ui',
    configKey: 'vidoConfigUI',
    version: '1.0.0',
    compatibility: {
      nuxt: '>=3.8.0',
    },
  },
  setup(options, _nuxt) {
    if (!options.enabled) {
      // eslint-disable-next-line no-console
      console.info('[@teritorio/vido-config-ui] Skipped - only enabled in development mode.')
      return
    }

    const { resolve } = createResolver(import.meta.url)

    addLayout({
      src: resolve('runtime/vido-config-ui-layout.vue'),
      filename: 'vido-config-ui.vue',
      write: true,
    }, 'vido-config-ui')

    extendPages((pages) => {
      pages.unshift({
        name: 'vido-config-ui',
        path: '/config',
        file: resolve('runtime/vido-config-ui.vue'),
        meta: {
          layout: 'vido-config-ui',
        },
      })
    })

    addComponentsDir({
      path: resolve('runtime/components'),
    })
  },
})
