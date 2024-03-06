import { setup } from '@storybook/vue3'
import type { Preview } from '@storybook/vue3'
import { propertyTranslationsVuePlugin } from '../plugins/property-translations'

setup((app) => {
  app.use(propertyTranslationsVuePlugin)
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
