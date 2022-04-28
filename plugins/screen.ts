import Vue from 'vue'
import VueScreen, { VueScreenObject } from 'vue-screen'

Vue.use(VueScreen, {
  extend: 'tailwind',
  smallScreen: (screen: VueScreenObject) => !screen.md,
  // Quick heuristic for device havng phone capability
  phone: (screen: VueScreenObject) => screen.touch && !screen.lg,
})

declare module 'vue/types/vue' {
  interface Vue {
    readonly $screen: VueScreenObject
  }
}
