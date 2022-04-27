import Vue from 'vue'
import VueScreen, { VueScreenObject } from 'vue-screen'

Vue.use(VueScreen, {
  extend: 'tailwind',
  smallScreen: (screen: VueScreenObject) => !screen.md,
})

declare module 'vue/types/vue' {
  interface Vue {
    readonly $screen: VueScreenObject
  }
}
