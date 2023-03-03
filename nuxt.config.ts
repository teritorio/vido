import { defineNuxtConfig } from 'nuxt/config'
// import { cypressMockMiddleware } from '@cypress/mock-ssr'

import { vidos } from './lib/config'
import { sitemapFilter, sitemapRoutes } from './lib/sitemap'
import { configuredApi, configuredImageProxy } from './plugins/vido-config'

const supportedLocales = ['en-GB', 'fr', 'es']

export default defineNuxtConfig({
  env: {
    // Copy NODE_ENV to know to real setting when use `nuxt build`
    environment: process.env.NODE_ENV as string,
  },

  runtimeConfig: {
    vidos,
    public: {
      vidos: vidos.__publicRuntimeConfig__ ? vidos : undefined,
    },
  },

  // pwa: {
  //   icon: false,
  //   meta: false,
  //   manifest: false,
  //   workbox: {
  //     enabled: true,
  //   },
  // },
  // // Global page headers (https://go.nuxtjs.dev/config-head)
  // head: {
  //   htmlAttrs: {
  //     lang: 'fr',
  //   },
  //   title: '@teritorio/vido',
  //   meta: [
  //     { charset: 'utf-8' },
  //     { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  //     { hid: 'description', name: 'description', content: '' },
  //   ],
  //   link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  // },

  router: {
    // prefetchLinks: false,
  },

  // @ts-ignore
  loadingIndicator: false,

  serverMiddleware: [
    //   ...(process.env.NODE_ENV != 'production' ? [cypressMockMiddleware()] : []),
    // { path: '/', handler: '~/api/manifest.ts' },
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
    { src: '@/plugins/tracking.ts', mode: 'client' },
    '@/plugins/property-translations.ts',
    { src: '@/plugins/pinia-shared-state.ts', mode: 'client' },
  ],

  // // Auto import components (https://go.nuxtjs.dev/config-components)
  // components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/vuetify',
    '@nuxtjs/svg',
    // '@nuxtjs/pwa',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/i18n',
    // '@nuxt/image',
    // '@nuxtjs/gtm',
    ...(process.env.SENTRY_DSN ? ['@nuxtjs/sentry'] : []),
    // '@nuxtjs/sitemap', // declare the sitemap module at end of array
    '@pinia/nuxt',
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

  // image: {
  //   domains: [...configuredApi(vidos), ...configuredImageProxy(vidos)],
  // },

  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  },

  // sitemap: {
  //   cacheTime: -1,
  //   routes: () => sitemapRoutes(vidos),
  //   filter: sitemapFilter,
  // },

  watchers: {
    chokidar: {
      // @ts-ignore
      ignor: (f) =>
        [
          /\.git/,
          /\.yarn/,
          /cypress/,
          /.*\.stories\.ts$/,
          /.*\.jest\.ts$/,
          /\.nuxt\/dist\/server\//,
        ].some((r) => r.test(f)),
    },
    webpack: {
      // @ts-ignore
      ignored:
        /\.git|\.yarn|cypress|.*\.stories\.ts$|.*\.jest\.ts$|\.nuxt\/dist\/server\//,
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    //   // @ts-ignore
    //   extend(config, { isClient }) {
    //     // Extend only webpack config for client-bundle
    //     if (isClient) {
    //       config.devtool = 'source-map'
    //     }
    //   },
    //   plugins: [
    //     // https://github.com/date-fns/date-fns/blob/main/docs/webpack.md
    //     // /!\ Not woring. Has no effect.
    //     new webpack.ContextReplacementPlugin(
    //       /date-fns\/locale$/,
    //       new RegExp('./(' + supportedLocales.join('|') + ')/index.js$')
    //     ),
    //   ],
    //   babel: {
    //     plugins: [
    //       ['@babel/plugin-proposal-class-properties', { loose: true }],
    //       ['@babel/plugin-proposal-private-methods', { loose: true }],
    //       ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    //     ],
    //   },
    // @ts-ignore
    transpile: [
      'iron-webcrypto',
      // If you use nuxt you must transpile the module so it can be used universally
      '@vueform/slider',
      'punycode',
      'pinia',
    ],
  },

  vuetify: {
    theme: false,
    treeShake: true,
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
      config.watchOptions.ignored = /node_modules|__screenshots__/
      return config
    },
    addons: ['storybook-addon-mock', 'storybook-addon-validate-html'],
  },

  // Google Tag Manager config
  gtm: {
    pageTracking: false,
  },

  devServerHandlers: [], // Workaround issue https://github.com/nuxt-community/tailwindcss-module/issues/480
})
