import { Plugin } from '@nuxt/types'

import Google from '@/lib/tracker-google'
import Matomo from '@/lib/tracker-matomo'
import { Event, Tracker } from '@/lib/trackers'
import { vidoConfig } from '@/plugins/vido-config'

const trackingPlugin: Plugin = ({ app, req }, inject) => {
  const trackers: Tracker[] = []

  if (navigator.doNotTrack !== '1') {
    const googleTagManagerId = vidoConfig(req).GOOGLE_TAG_MANAGER_ID
    if (app.$gtm && googleTagManagerId) {
      trackers.push(new Google(app.$gtm, googleTagManagerId))
    }

    const matomoUrl = vidoConfig(req).MATOMO_URL
    const matomoIdsite = vidoConfig(req).MATOMO_SITEID
    if (matomoUrl && matomoIdsite) {
      trackers.push(new Matomo(matomoUrl, matomoIdsite))
    }
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
