import { readFileSync } from 'node:fs'
import { addTemplate, createResolver, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'vido-config-ui',
    configKey: 'vidoConfigUI',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    addTemplate({
      filename: 'layouts/vido-config-ui.vue',
      write: true,
      getContents: () =>
        readFileSync(resolver.resolve('layouts/vido-config-ui.vue'), 'utf-8'),
    })

    const pageTemplate = addTemplate({
      filename: 'pages/vido-config-ui.vue',
      write: true,
      getContents: () =>
        readFileSync(resolver.resolve('pages/vido-config-ui.vue'), 'utf-8'),
    })

    if (nuxt.options.dev) {
      nuxt.hook('pages:extend', (pages) => {
        pages.push({
          name: 'vido-config-ui',
          path: '/config',
          file: pageTemplate.dst,
        })
      })
      nuxt.hook('components:dirs', (dirs) => {
        dirs.push({
          path: resolver.resolve('components'),
          prefix: 'VidoConfig', // use <VidoConfigInstanceCard />
        })
      })
    }
    else {
      console.warn('[@teritorio/vido-config-ui] Skipped - only enabled in development mode.')
    }
  },
})
