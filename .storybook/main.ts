import { resolve } from 'node:path'
import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    (config.define = { 'process.env': {} })
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '~': resolve(__dirname, '../'),
        // Maybe we could take advantage of auto-imports
        '#app': resolve(__dirname, '../node_modules/nuxt/dist/app'),
        '#head': resolve(__dirname, '../node_modules/nuxt/dist/head/runtime'),
        '#build': resolve(__dirname, '../.nuxt'),
        '#imports': resolve(__dirname, '../.nuxt/imports'),
        '#image': resolve(__dirname, '../node_modules/@nuxt/image-edge/dist/runtime'),
      }
    }

    return config
  },
}
export default config
