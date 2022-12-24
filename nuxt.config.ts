// @ts-ignore
import { cypressMockMiddleware } from '@cypress/mock-ssr'
import { NuxtConfig } from '@nuxt/types'
import fs from 'fs'
import webpack from 'webpack'

import { ApiMenuCategory, getMenu } from './lib/apiMenu'
import { getPois } from './lib/apiPois'
import { configuredApi, configuredImageProxy } from './plugins/vido-config'
import { VidosConfig } from './utils/types-config'

const supportedLocales = ['en-GB', 'fr', 'es']

const vidos: VidosConfig = !process.env.CONFIG
  ? {}
  : JSON.parse(
      fs.readFileSync(process.env.CONFIG || 'vidos-config.json').toString()
    )

let vidosRoutesCategories: {
  [hostname: string]: { url: string; lastmod?: string }[]
} = {}
let vidosRoutesPois: {
  [hostname: string]: { url: string; lastmod?: string }[]
} = {}

const config: NuxtConfig = {
  env: {
    // Copy NODE_ENV to know to real setting when use `nuxt build`
    environment: process.env.NODE_ENV as string,
  },

  privateRuntimeConfig: {
    vidos,
  },

  publicRuntimeConfig: {
    vidos: vidos.__publicRuntimeConfig__ ? vidos : undefined,
  },

  pwa: {
    meta: {
      lang: 'fr',
    },
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    htmlAttrs: {
      lang: 'fr',
    },
    title: '@teritorio/vido',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  loading: false,

  serverMiddleware: [
    ...(process.env.NODE_ENV != 'production' ? [cypressMockMiddleware()] : []),
  ],

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],

  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/vido-config.ts',
    '@/plugins/settings.ts',
    '@/plugins/fontawesome.ts',
    '@/plugins/touch.ts',
    '@/plugins/screen.ts',
    '@/plugins/vue-tailwind.ts',
    { src: '@/plugins/tracking.ts', mode: 'client' },
    '@/plugins/property-translations.ts',
    { src: '~plugins/vuex-shared-mutations.js', ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/svg',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/gtm',
    ...(process.env.SENTRY_DSN ? ['@nuxtjs/sentry'] : []),
    '@nuxtjs/sitemap', // declare the sitemap module at end of array
  ],

  i18n: {
    strategy: 'no_prefix',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: false,
    },
    locales: [
      { code: 'en', name: 'English', flag: 'GB', iso: 'en-US', file: 'en.js' },
      { code: 'es', name: 'Español', flag: 'ES', iso: 'es-ES', file: 'es.js' },
      { code: 'fr', name: 'Français', flag: 'FR', iso: 'fr-FR', file: 'fr.js' },
    ],
    defaultLocale: 'en',
    langDir: '~/locales/',
  },

  image: {
    domains: [...configuredApi(vidos), ...configuredImageProxy(vidos)],
  },

  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  },

  sitemap: {
    cacheTime: -1,
    async routes() {
      return Promise.all(
        Object.entries(vidos).map(([hostname, vido]) =>
          Promise.all([
            getMenu(vido.API_ENDPOINT, vido.API_PROJECT, vido.API_THEME).then(
              (menuItems) => {
                vidosRoutesCategories[hostname] = menuItems
                  .filter((menuItem) => menuItem.category && menuItem.id)
                  .map((menuCategory) => ({
                    url: `/${menuCategory.id}/`,
                  }))
              }
            ),
            getPois(
              vido.API_ENDPOINT,
              vido.API_PROJECT,
              vido.API_THEME,
              undefined,
              {
                geometry_as: 'point',
                short_description: true,
              }
            ).then((pois) => {
              vidosRoutesPois[hostname] = pois.features.map((poi) => ({
                url: `/poi/${poi.properties.metadata.id}/details`,
                lastmod: poi.properties.metadata.updated_at,
              }))
            }),
          ])
        )
      )
    },
    filter({
      routes,
      options,
    }: {
      routes: any
      options: { hostname: string }
    }) {
      // Hack the filter function to add hostname dependents routes.
      const hostname = options.hostname.split('/')[1].split(':')[0]
      routes = [
        ...routes,
        ...[
          ...(vidosRoutesCategories[hostname] || []),
          ...(vidosRoutesPois[hostname] || []),
        ].map((page) => ({
          chunkName: undefined,
          component: undefined,
          name: undefined,
          path: undefined,
          ...page,
        })),
      ]
      return routes
    },
  },

  watchers: {
    chokidar: {
      ignored: (f) =>
        [
          /\.git/,
          /\.yarn/,
          /cypress/,
          /.*\.stories\.ts$/,
          /.*\.jest\.ts$/,
        ].some((r) => r.test(f)),
    },
    webpack: {
      ignored: [
        /\.git/,
        /\.yarn/,
        /cypress/,
        /.*\.stories\.ts$/,
        /.*\.jest\.ts$/,
      ],
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.devtool = 'source-map'
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: 'maplibre-gl',
      }),
      // https://github.com/date-fns/date-fns/blob/main/docs/webpack.md
      // /!\ Not woring. Has no effect.
      new webpack.ContextReplacementPlugin(
        /date-fns\/locale$/,
        new RegExp('./(' + supportedLocales.join('|') + ')/index.js$')
      ),
    ],
    babel: {
      plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ],
    },
  },

  // Server config (allow listening to local network)
  server: {
    host: '0.0.0.0',
  },

  // Storybook module configuration (https://storybook.nuxtjs.org/setup)
  storybook: {
    typescript: { check: false },
    port: 4000,
    // addons: ['@storybook/addon-controls', '@storybook/addon-notes'],
    // @ts-ignore
    webpackFinal(config) {
      config.watchOptions.ignored = [/node_modules/, /__screenshots__/]
      return config
    },
    addons: ['storybook-addon-mock'],
  },

  // Google Tag Manager config
  gtm: {
    pageTracking: false,
  },

  devServerHandlers: [], // Workaround issue https://github.com/nuxt-community/tailwindcss-module/issues/480
}

export default config
