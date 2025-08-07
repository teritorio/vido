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
  gtm: {
    pageTracking: false,
  },
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
  image: {
    domains: [...configuredApi(vidos), ...configuredImageProxy(vidos)],
  },
  imports: {
    autoImport: true,
  },
  loadingIndicator: false,
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/image-edge',
    '@pinia/nuxt',
    '@kevinmarrec/nuxt-pwa',
    async (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config =>
        // @ts-expect-error: Do we really need to extend the config ?
        config.plugins.push(vuetify()))
    },
  ],
  runtimeConfig: {
    public: {
      // @ts-expect-error: Bad pratice, make it the Nuxt way (https://nuxt.com/docs/guide/going-further/runtime-config)
      vidos: vidos.__publicRuntimeConfig__ ? vidos : undefined,
      cypress: process.env.CYPRESS,
      sentry: {
        dsn: undefined,
        environment: 'production',
      },
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
  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  },
  pwa: {
    icon: false,
    meta: false,
    manifest: false,
    workbox: {
      enabled: false,
    },
  },
  server: {
    host: '0.0.0.0',
  },
  typescript: {
    typeCheck: 'build',
  },
  vite: {
    optimizeDeps: { exclude: ['fsevents'] },
  },
})
