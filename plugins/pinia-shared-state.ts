import { Plugin } from '@nuxt/types'
import { PiniaSharedState } from 'pinia-shared-state'

const piniaSharedState: Plugin = ({ $pinia }) => {
  $pinia.use(
    PiniaSharedState({
      enable: false,
    })
  )
}

export default piniaSharedState
