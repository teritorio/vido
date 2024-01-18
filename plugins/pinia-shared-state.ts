import type { Pinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'

import { defineNuxtPlugin } from '#app/nuxt'

const piniaSharedState = defineNuxtPlugin(({ $pinia }) => {
  ($pinia as Pinia).use(
    PiniaSharedState({
      enable: false,
    }),
  )
})

export default piniaSharedState
