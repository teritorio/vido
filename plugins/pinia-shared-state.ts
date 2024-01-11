import { Plugin } from '@nuxt/types'
import { Pinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'

import { defineNuxtPlugin } from '#app/nuxt'

// @ts-ignore
const piniaSharedState: Plugin = defineNuxtPlugin(({ $pinia }) => {
  ($pinia as Pinia).use(
    PiniaSharedState({
      enable: false,
    })
  )
})

export default piniaSharedState
