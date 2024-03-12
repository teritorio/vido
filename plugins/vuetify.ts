import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import 'vuetify/styles'

import { defineNuxtPlugin } from '#app/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      VDataTable,
      VSkeletonLoader,
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
