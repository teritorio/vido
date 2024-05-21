import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { en, es, fr } from 'vuetify/locale'
import 'vuetify/styles'
import { defineNuxtPlugin } from '#app/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    locale: {
      locale: (nuxtApp.$i18n as any).locale.value,
      fallback: (nuxtApp.$i18n as any).fallbackLocale.value,
      messages: { en, es, fr },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    ssr: true,
  })

  nuxtApp.vueApp.use(vuetify)
})
