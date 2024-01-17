const path = require('node:path')

module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      options: {
        cssLoaderOptions: {
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    'storybook-addon-mock',
    'storybook-addon-validate-html',
  ],
  framework: '@storybook/vue3',
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config, options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname, '../'),
      '#app': path.resolve(__dirname, '../node_modules/nuxt/dist/app'),
      '#app/*': path.resolve(__dirname, '../node_modules/nuxt/dist/app/*'),
      '#head': path.resolve(__dirname, '../node_modules/nuxt/dist/head/runtime'),
      '#head/*': path.resolve(__dirname, '../node_modules/nuxt/dist/head/runtime/*'),
      '#build': path.resolve(__dirname, '../.nuxt'),
      '#build/*': path.resolve(__dirname, '../.nuxt/*'),
    }
    return config
  },
}
