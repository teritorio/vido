import Vue3TouchEvents from 'vue3-touch-events'

import { defineNuxtPlugin } from '#app/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3TouchEvents)
})
