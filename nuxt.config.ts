import { defineNuxtConfig } from 'nuxt/config'
import topLevelAwait from 'vite-plugin-top-level-await'
import vuetify from 'vite-plugin-vuetify'

import { vidos } from './lib/config'
import { configuredApi, configuredImageProxy } from './utils/vido-config-static'

export default defineNuxtConfig({
  env: {
    // Copy NODE_ENV to know to real setting when use `nuxt build`
    environment: process.env.NODE_ENV as string,
  },

  runtimeConfig: {
    vidos,
    public: {
      // @ts-ignore
      vidos: vidos.__publicRuntimeConfig__ ? vidos : undefined,
      cypress: process.env.CYPRESS,
    },
  },

  pwa: {
    icon: false,
    meta: false,
    manifest: false,
    workbox: {
      enabled: true,
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

  router: {
    // prefetchLinks: false,
  },

  // @ts-ignore
  loadingIndicator: false,

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
    '@/plugins/device.ts',
    { src: '@/plugins/tracking.ts', mode: 'client' },
    '@/plugins/property-translations.ts',
    { src: '@/plugins/pinia-shared-state.ts', mode: 'client' },
  ],

  imports: {
    autoImport: false,
  },

  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image-edge',
    ...(process.env.SENTRY_DSN ? ['@nuxtjs/sentry'] : []),
    '@pinia/nuxt',
    '@kevinmarrec/nuxt-pwa',
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) =>
        // @ts-ignore
        config.plugins.push(vuetify())
      )
    },
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
    langDir: 'locales/',
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

  watchers: {
    chokidar: {
      // @ts-ignore
      ignor: (f) =>
        [
          /\.git/,
          /\.yarn/,
          /cypress/,
          /.*\.story\.vue$/,
          /\.nuxt\/dist\/server\//,
        ].some((r) => r.test(f)),
    },
    webpack: {
      // @ts-ignore
      ignored: /\.git|\.yarn|cypress|.*\.story\.vue$|\.nuxt\/dist\/server\//,
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: [
      'iron-webcrypto',
      'punycode',
      'pinia',
      'vuetify',
      'date-fns',
      /lodash.*/,
    ],
  },

  typescript: {
    typeCheck: !!process.env.TYPESCRIPT_CHECK,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    clearScreen: false,
    plugins: [
      // Add support for old browser of
      // const { ... } = await import('maplibre-gl')
      topLevelAwait(),
    ],
    optimizeDeps: {
      exclude: ['vite-plugin-top-level-await'],
    },
  },

  // Server config (allow listening to local network)
  server: {
    host: '0.0.0.0',
  },

  // Google Tag Manager config
  gtm: {
    pageTracking: false,
  },
})
