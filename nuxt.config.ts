import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'
import checker from 'vite-plugin-checker'

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
    experimental: {
      jsTsFormatResource: true,
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
    ...(process.env.SENTRY_DSN ? ['@nuxtjs/sentry'] : []),
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
    },
  },
  plugins: [
    '@/plugins/vido-config.ts',
    '@/plugins/settings.ts',
    '@/plugins/fontawesome.ts',
    '@/plugins/touch.ts',
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
  pwa: {
    icon: false,
    meta: false,
    manifest: false,
    workbox: {
      enabled: false,
    },
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  },
  server: {
    host: '0.0.0.0',
  },
  typescript: {
    typeCheck: !process.env.CYPRESS,
  },
  vite: {
    optimizeDeps: { exclude: ['fsevents'] },
    plugins: [!process.env.CYPRESS ? checker({ vueTsc: true }) : undefined],
  },
})
