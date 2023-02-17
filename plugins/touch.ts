import { defineNuxtPlugin } from '#app/nuxt'
import Vue2TouchEvents from 'vue2-touch-events'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue2TouchEvents)
})
