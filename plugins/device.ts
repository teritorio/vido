import { computed } from 'vue'
import { useScreen, useGrid } from 'vue-screen'

import { defineNuxtPlugin } from '#app/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  const screen = useScreen()
  const grid = useGrid('tailwind')
  return {
    provide: {
      device: computed(() => ({
        smallScreen: !grid.md,
        touch: screen.touch,
        // Quick heuristic for device havng phone capability
        phone: screen.touch && !grid.lg,
      })),
    },
  }
})
