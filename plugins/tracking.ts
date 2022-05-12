import { Plugin } from '@nuxt/types'

import Google from '@/lib/tracker-google'
import { Event, Tracker } from '@/lib/trackers'
import { vidoConfig } from '@/plugins/vido-config'

const trackingPlugin: Plugin = ({ app, req }, inject) => {
  const trackers: Tracker[] = []

  const googleTagManagerId = vidoConfig(req).GOOGLE_TAG_MANAGER_ID
  if (app.$gtm && googleTagManagerId) {
    trackers.push(new Google(app.$gtm, googleTagManagerId))
  }

  inject('tracking', (event: Event) => {
    if (!trackers) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Tracking event', event)
      }
    } else {
      trackers.forEach((tracker) => {
        tracker.track(event)
      })
    }
  })
}

export default trackingPlugin

declare module 'vue/types/vue' {
  interface Vue {
    readonly $tracking: (event: Event) => undefined
  }
}
