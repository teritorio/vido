import Vue3TouchEvents, { type Vue3TouchEventsOptions } from 'vue3-touch-events'

import { defineNuxtPlugin } from '#app/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {})
})
