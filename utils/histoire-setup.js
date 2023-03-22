import '@teritorio/font-teritorio/teritorio/teritorio.css'
import { defineSetupVue3 } from '@histoire/plugin-vue'
import get from 'lodash.get'

import en from '~/locales/en.js'
import vuetify from '~/plugins/vuetify'

// Load tailwind after vuetify
import '../assets/tailwind.scss'

export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {
  // Mock globals
  app.config.globalProperties.$t = (key) => get(en, key, key)
  app.config.globalProperties.$d = (key) => key
  app.config.globalProperties.$n = (key) => key

  // Plugins
  vuetify({ vueApp: app })
})
