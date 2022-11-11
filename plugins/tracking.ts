import { Plugin } from '@nuxt/types'

import Google from '~/lib/tracker-google'
import Matomo from '~/lib/tracker-matomo'
import { Event, Tracker } from '~/lib/trackers'
import { vidoConfig } from '~/plugins/vido-config'

const trackingPlugin: Plugin = ({ app, req }, inject) => {
  const trackers: Tracker[] = []
  const config = vidoConfig(req)

  if (navigator.doNotTrack !== '1') {
    const googleTagManagerId = config.GOOGLE_TAG_MANAGER_ID
    if (app.$gtm && googleTagManagerId) {
      trackers.push(
        new Google(
          Boolean(config.COOKIES_CONSENT),
          app.$gtm,
          googleTagManagerId
        )
      )
    }

    const matomoUrl = config.MATOMO_URL
    const matomoIdsite = config.MATOMO_SITEID
    if (matomoUrl && matomoIdsite) {
      trackers.push(
        new Matomo(Boolean(config.COOKIES_CONSENT), matomoUrl, matomoIdsite)
      )
    }
  }

  inject('tracking_consent', () => {
    if (trackers.length > 0) {
      trackers.forEach((tracker) => {
        tracker.consent(app)
      })
    }
  })

  inject('tracking', (event: Event) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Tracking event', event)
    }

    trackers.forEach((tracker) => {
      tracker.track(event)
    })
  })
}

export default trackingPlugin

declare module 'vue/types/vue' {
  interface Vue {
    readonly $tracking_consent: () => undefined
    readonly $tracking: (event: Event) => undefined
  }
}
