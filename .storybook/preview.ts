import { setup } from '@storybook/vue3'
import type { Preview } from '@storybook/vue3'
import { createI18n } from 'vue-i18n'
import { propertyTranslationsVuePlugin } from '../plugins/property-translations'
import messages from '../locales'

// After @nuxtjs/i18n module update
// try to use config from config/i18n.config.ts
const i18n = createI18n({
  langDir: 'locales',
  messages,
  legacy: false,
  locale: 'en',
})

const globalTypes = {
  locale: {
    defaultValue: 'en',
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English', left: '🇬🇧' },
        { value: 'fr', title: 'Français', left: '🇫🇷' },
        { value: 'es', title: 'Spanish', left: '🇪🇸' },
      ],
      showName: true,
    },
  },
}

function i18nDecorator(story, context) {
  const { locale } = context.globals
  i18n.global.locale.value = locale
  return story()
}

const preview: Preview = {
  globalTypes,
  decorators: [i18nDecorator],
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

setup((app) => {
  app.use(i18n)
  app.use(propertyTranslationsVuePlugin)
})

export default preview
