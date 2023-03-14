import { useScreen, useGrid } from 'vue-screen'

import { defineNuxtPlugin } from '#app/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  const screen = useScreen()
  const grid = useGrid('tailwind')
  return {
    provide: {
      screen: {
        smallScreen: !grid.md,
        // Quick heuristic for device havng phone capability
        phone: screen.touch && grid.lg,
      },
    },
  }
})
