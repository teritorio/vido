import type { Plugin } from '@nuxt/types'
import type { Pinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'

import { defineNuxtPlugin } from '#app/nuxt'

// @ts-expect-error
const piniaSharedState: Plugin = defineNuxtPlugin(({ $pinia }) => {
  ($pinia as Pinia).use(
    PiniaSharedState({
      enable: false,
    }),
  )
})

export default piniaSharedState
