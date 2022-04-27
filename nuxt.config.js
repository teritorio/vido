import webpack from 'webpack'

export default {
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
    '@/plugins/vido-config.ts',
    '@/plugins/fontawesome.ts',
    '@/plugins/touch.ts',
    '@/plugins/screen.ts',
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
    '@nuxtjs/gtm',
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
    pageTracking: false,
  },
}
