import { createVuetify } from 'vuetify'
import { defineNuxtPlugin } from '#app/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
  })

  nuxtApp.vueApp.use(vuetify)
})
