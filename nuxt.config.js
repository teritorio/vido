import dotenv from 'dotenv'
import webpack from 'webpack'

dotenv.config()

function checkEnvVariable(variableName) {
  if (!process.env[variableName]) {
    throw new Error(`Vido: The ${variableName} environment variable must exist`)
  }
}

checkEnvVariable('API_ENDPOINT')
checkEnvVariable('VECTO_STYLE_URL')
checkEnvVariable('SATELLITE_STYLE_URL')
checkEnvVariable('VECTO_TILES_URL')

export default {
  target: 'static',
  publicRuntimeConfig: {
    API_ENDPOINT: process.env.API_ENDPOINT || '',
    VECTO_STYLE_URL: process.env.VECTO_STYLE_URL || '',
    SATELLITE_STYLE_URL: process.env.SATELLITE_STYLE_URL || '',
    VECTO_TILES_URL: process.env.VECTO_TILES_URL || '',
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
    'vue-multiselect/dist/vue-multiselect.min.css',
  ],

  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/, /multiselect.*/],
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/fontawesome.ts',
    '@/plugins/mobile.ts',
    '@/plugins/vue-tailwind.ts',
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
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/gtm',
    '@nuxtjs/i18n',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  i18n: {
    strategy: 'no_prefix',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: false,
    },
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.js' },
      { code: 'es', name: 'Español', iso: 'es-ES', file: 'es.js' },
      { code: 'fr', name: 'Français', iso: 'fr-FR', file: 'fr.js' },
    ],
    defaultLocale: 'en',
    langDir: '~/locales/',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
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
    pageTracking: true,
  },
}
