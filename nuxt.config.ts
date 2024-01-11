import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

import { vidos } from './lib/config'
import { configuredApi, configuredImageProxy } from './utils/vido-config-static'

// Build Configuration (https://nuxt.com/docs/api/nuxt-config)
export default defineNuxtConfig({
  build: {
    transpile: [
      process.env.NODE_ENV === 'production' ? 'maplibre-gl' : '',
      'iron-webcrypto',
      'punycode',
      'pinia',
      'vuetify',
      'date-fns',
      /lodash.*/,
      '@fortawesome/vue-fontawesome',
    ],
  },
  buildModules: ['@nuxtjs/stylelint-module'],
  components: false,
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  gtm: {
    pageTracking: false,
  },
  head: {
    htmlAttrs: {
      lang: 'fr',
    },
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    title: '@teritorio/vido',
  },
  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: false,
    },
    langDir: 'locales/',
    locales: [
      { code: 'en', name: 'English', flag: 'GB', iso: 'en-US', file: 'en.js' },
      { code: 'es', name: 'Español', flag: 'ES', iso: 'es-ES', file: 'es.js' },
      { code: 'fr', name: 'Français', flag: 'FR', iso: 'fr-FR', file: 'fr.js' },
    ],
    strategy: 'no_prefix',
  },
  image: {
    domains: [...configuredApi(vidos), ...configuredImageProxy(vidos)],
  },
  imports: {
    autoImport: false,
  },
  loadingIndicator: false,
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image-edge',
    // process.env.SENTRY_DSN ? ['@nuxtjs/sentry'] : [],
    '@pinia/nuxt',
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) =>
        // @ts-ignore
        config.plugins.push(vuetify())
      )
    },
  ],
  runtimeConfig: {
    public: {
      // @ts-ignore
      vidos: vidos.__publicRuntimeConfig__ ? vidos : undefined,
      cypress: process.env.CYPRESS,
    },
  },
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
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  }, 
  // sentry: {
  //   dsn: process.env.SENTRY_DSN || '',
  //   // https://sentry.nuxtjs.org/sentry/options
  //   config: {
  //     // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
  //   },
  // },
  server: {
    host: '0.0.0.0',
  },
  typescript: {
    shim: false
  },
  vite: {
    optimizeDeps: { exclude: ['fsevents'] },
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
  }
})
