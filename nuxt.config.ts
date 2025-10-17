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
  components: false,
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  devtools: { enabled: true },
  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: false,
    },
    langDir: 'locales',
    lazy: true,
    locales: [
      { code: 'en', name: 'English', flag: 'GB', iso: 'en-GB', file: 'en-GB.ts' },
      { code: 'es', name: 'Español', flag: 'ES', iso: 'es-ES', file: 'es-ES.ts' },
      { code: 'fr', name: 'Français', flag: 'FR', iso: 'fr-FR', file: 'fr-FR.ts' },
    ],
    strategy: 'no_prefix',
    vueI18n: 'config/i18n.config.ts',
  },
  // image: {
  //   domains: [...configuredApi(vidos), ...configuredImageProxy(vidos)],
  // },
  imports: {
    autoImport: true,
  },
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image-edge',
    '@pinia/nuxt',
    '@kevinmarrec/nuxt-pwa',
    async (_options: any, nuxt: any) => {
      nuxt.hooks.hook('vite:extendConfig', (config: any) =>
        config.plugins.push(vuetify()))
    },
  ],
  runtimeConfig: {
    public: {
      cypress: process.env.CYPRESS,
      vidos: vidos(),
      appHost: process.env.NUXT_PUBLIC_APP_HOST,
      apiEndpoint: process.env.NUXT_PUBLIC_API_ENDPOINT,
      apiSearch: process.env.NUXT_PUBLIC_API_SEARCH,
      apiAddr: process.env.NUXT_PUBLIC_API_ADDR,
      apiExport: process.env.NUXT_PUBLIC_API_EXPORT,
      apiQrShortener: process.env.NUXT_PUBLIC_API_QR_SHORTENER,
      mapillaryAccessToken: process.env.NUXT_PUBLIC_MAPILLARY_ACCESS_TOKEN || '',
      openRouteServiceKey: process.env.NUXT_PUBLIC_OPEN_ROUTE_SERVICE_KEY || '',
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
      sentryEnvironment: process.env.NUXT_PUBLIC_SENTRY_ENVIRONMENT,
    },
  },
  plugins: [
    '@/plugins/vido-config.ts',
    '@/plugins/fontawesome.ts',
    '@/plugins/touch.ts',
    { src: '@/plugins/tracking.ts', mode: 'client' },
    { src: '@/plugins/pinia-shared-state.ts', mode: 'client' },
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pwa: {
    icon: false,
    meta: false,
    manifest: false,
    workbox: {
      enabled: false,
    },
  },
  devServer: {
    host: '0.0.0.0',
  },
  typescript: {
    typeCheck: 'build',
  },
  vite: {
    optimizeDeps: { exclude: ['fsevents'] },
  },
})
