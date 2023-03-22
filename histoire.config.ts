import { HstNuxt } from '@histoire/plugin-nuxt'
import { HstVue } from '@histoire/plugin-vue'
import { defineConfig } from 'histoire'

import { HstScreenshot } from './utils/histoire-plugin-screenshot'

export default defineConfig({
  storyMatch: ['**/*.story.vue'],
  storyIgnored: [
    '**/node_modules/**', // Keep as overite default
    '**/dist/**', // Keep as overite default
    '.histoire/plugins/builtin_tailwind-tokens/**/*', // Remove builtins
    '**/Map/**/*.story.vue', // import maplibre fails
    '**/PoiDetails.story.vue', // import maplibre fails
    '**/MapFeatures.story.vue', // import maplibre fails
  ],
  setupFile: 'utils/histoire-setup.js',
  plugins: [
    HstVue(),
    HstNuxt(),
    HstScreenshot({
      saveFolder: '__screenshots__/current',
      ignored: (payload: {
        file: string
        story: { title: string }
        variant: { id: string; title: string }
      }) =>
        payload.story.title === 'Tailwind' || // Remove builtins
        (payload.file.endsWith('Field.story.vue') &&
          payload.variant.title === 'StartEndDate'), // Error on rendering
      presets: [
        {
          width: 800,
          height: 600,
        },
      ],
    }),
  ],
  defaultStoryProps: {
    layout: {
      type: 'grid',
      width: '100%',
    },
  },
  responsivePresets: [
    {
      label: 'Mobile (Medium)',
      width: 360,
      height: 640,
    },
  ],
})
