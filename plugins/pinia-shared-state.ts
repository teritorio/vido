import { Plugin } from '@nuxt/types'
import { PiniaSharedState } from 'pinia-shared-state'

import { defineNuxtPlugin } from '#app/nuxt'

// @ts-ignore
const piniaSharedState: Plugin = defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(
    PiniaSharedState({
      enable: false,
    })
  )
})

export default piniaSharedState
