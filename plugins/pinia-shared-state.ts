import { PiniaSharedState } from 'pinia-shared-state'

export default () => {
  window.onNuxtReady((nuxt) => {
    nuxt.$pinia.use(
      PiniaSharedState({
        enable: false,
      })
    )
  })
}
