import dotenv from 'dotenv'
import webpack from 'webpack'

dotenv.config()

function checkEnvVariable(variableName) {
  if (!process.env[variableName]) {
    throw new Error(`Vido: The ${variableName} environment variable must exist`)
  }
}

checkEnvVariable('API_ENDPOINT')
checkEnvVariable('IGN_TOKEN')
checkEnvVariable('TILES_TOKEN')
checkEnvVariable('VECTO_STYLE_URL')
checkEnvVariable('VECTO_TILES_URL')

export default {
  publicRuntimeConfig: {
    API_ENDPOINT: process.env.API_ENDPOINT || '',
    IGN_TOKEN: process.env.IGN_TOKEN || '',
    TILES_TOKEN: process.env.TILES_TOKEN || '',
    VECTO_STYLE_URL: process.env.VECTO_STYLE_URL || '',
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
    // title: 'cool',
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
  plugins: ['@/plugins/fontawesome.ts', '@/plugins/mobile.ts'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    [
      '@nuxt/typescript-build',
      // Workaround : https://github.com/nuxt/typescript/issues/145#issuecomment-710755252
      {
        typeCheck: {
          typescript: require.resolve('typescript'),
        },
      },
    ],
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
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

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
    id: 'GTM-5J5XBKJ',
    enabled: true,
    pageTracking: true,
  },
}
