import dotenv from 'dotenv'
import webpack from 'webpack'

dotenv.config()

function checkEnvVariable(variableName) {
  if (!process.env[variableName]) {
    throw new Error(`Vido: The ${variableName} environment variable must exist`)
  }
}

checkEnvVariable('API_ENDPOINT')
checkEnvVariable('API_SEARCH')
checkEnvVariable('API_SEARCH_ADDR')
checkEnvVariable('API_PROJECT')
checkEnvVariable('API_THEME')
checkEnvVariable('API_EXPORT')
checkEnvVariable('API_QR_SHORTENER')
checkEnvVariable('VECTO_STYLE_URL')
checkEnvVariable('SATELLITE_STYLE_URL')
checkEnvVariable('RASTER_STYLE_URL')

export default {
  publicRuntimeConfig: {
    API_ENDPOINT: process.env.API_ENDPOINT || '',
    API_SEARCH: process.env.API_SEARCH || '',
    API_SEARCH_ADDR: process.env.API_SEARCH_ADDR || '',
    API_PROJECT: process.env.API_PROJECT || '',
    API_THEME: process.env.API_THEME || '',
    API_EXPORT: process.env.API_EXPORT || '',
    API_QR_SHORTENER: process.env.API_QR_SHORTENER || '',
    VECTO_STYLE_URL: process.env.VECTO_STYLE_URL || '',
    SATELLITE_STYLE_URL: process.env.SATELLITE_STYLE_URL || '',
    RASTER_STYLE_URL: process.env.RASTER_STYLE_URL || '',
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID || '',
    NOTEBOOK_ENABLED: process.env.NOTEBOOK_ENABLED || '',
  },
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT || '',
    API_SEARCH: process.env.API_SEARCH || '',
    API_SEARCH_ADDR: process.env.API_SEARCH_ADDR || '',
    API_PROJECT: process.env.API_PROJECT || '',
    API_THEME: process.env.API_THEME || '',
    API_EXPORT: process.env.API_EXPORT || '',
    API_QR_SHORTENER: process.env.API_QR_SHORTENER || '',
    VECTO_STYLE_URL: process.env.VECTO_STYLE_URL || '',
    SATELLITE_STYLE_URL: process.env.SATELLITE_STYLE_URL || '',
    RASTER_STYLE_URL: process.env.RASTER_STYLE_URL || '',
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID || '',
    NOTEBOOK_ENABLED: process.env.NOTEBOOK_ENABLED || '',
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

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'maplibre-gl/dist/maplibre-gl.css',
    '@fontsource/ubuntu',
  ],

  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/],
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/fontawesome.ts',
    '@/plugins/mobile.ts',
    '@/plugins/vue-tailwind.ts',
    '@/plugins/tracking.ts',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    ['@nuxt/typescript-build'],
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/svg',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/i18n',
    ...(process.env.GOOGLE_TAG_MANAGER_ID ? ['@nuxtjs/gtm'] : []),
    ...(process.env.SENTRY_DSN ? ['@nuxtjs/sentry'] : []),
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

  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
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
    ],
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
    stories: ['@/pages/**/*.stories.js', '@/components/**/*.stories.js'],
  },

  // Google Tag Manager config
  gtm: {
    id: process.env.GOOGLE_TAG_MANAGER_ID,
    enabled: Boolean(process.env.GOOGLE_TAG_MANAGER_ID),
    pageTracking: false,
  },
}
