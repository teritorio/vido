import { defineNuxtPlugin } from '#app/nuxt'
import { VueScreenObject } from 'vue-screen'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      screen: {
        smallScreen: (screen: VueScreenObject): boolean => !screen.md,
        // Quick heuristic for device havng phone capability
        phone: (screen: VueScreenObject): boolean => screen.touch && !screen.lg,
      }
    }
  }
})
