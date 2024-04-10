import { createGtm } from '@gtm-support/vue-gtm'
import type { App } from 'nuxt/dist/app/compat/vue-demi'
import urlSlug from 'url-slug'

import type { Event, Tracker } from '~/lib/trackers'

export default class Google implements Tracker {
  waitForConsent: boolean
  gtm: any

  constructor(app: App, waitForConsent: boolean, googleTagManagerId: string) {
    const gtm = createGtm({
      id: googleTagManagerId,
      defer: true,
      compatibility: false,
      enabled: !waitForConsent,
    })
    app.use(gtm)

    this.waitForConsent = waitForConsent
  }

  consent(app: App) {
    if (this.waitForConsent) {
      const gtm = app.config.globalProperties.$gtm
      gtm.enable(true)
    }
  }

  track(app: App, event: Event) {
    const gtm = app.config.globalProperties.$gtm
    if (!gtm.enabled())
      return

    switch (event.type) {
      case 'page': {
        window.dataLayer?.push({
          event: 'pageview',
          pageType: 'PageView',
          pageTitle: event.title,
          pageLocation: event.location,
          pagePath: event.path,
          origin: event.origin,
        })
        break
      }
      case 'menu': {
        window.dataLayer?.push({
          event: 'pageview',
          pageType: 'PageView',
          pageTitle: event.title,
          pagePath: `/${urlSlug(event.title)}-${event.menuItemId}/`,
        })
        break
      }
      case 'category_event': {
        window.dataLayer?.push({
          event: event.type,
          action: event.event,
          categoryId: event.categoryId,
          title: event.title,
        })
        break
      }
      case 'notebook_event':
      case 'search': {
        window.dataLayer?.push({
          event: 'pageview',
          pageType: 'PageView',
          pageTitle: event.type,
          pagePath: `/${urlSlug(event.type)}`,
        })
        break
      }
      // case 'search_query': {}
      case 'search_result_event': {
        window.dataLayer?.push({
          event: event.type,
          action: event.event,
          type: event.resultType,
          title: event.title,
        })
        break
      }
      case 'popup': {
        window.dataLayer?.push({
          event: 'pageview',
          pageType: 'PageView',
          pageTitle: event.title,
          pageLocation: event.location,
          pagePath: `/${event.title}-${event.poiId}`,
          poiId: event.poiId,
          categoryIds: event.categoryIds,
        })
        break
      }
      case 'popup_event': {
        window.dataLayer?.push({
          event: event.type,
          action: event.event,
          poiId: event.poiId,
          category: event.category,
          title: event.title,
        })
        break
      }
      case 'map_control_event': {
        window.dataLayer?.push({ event: event.type, action: event.event })
        break
      }
      case 'favorites_event': {
        window.dataLayer?.push({ event: event.type, action: event.event })
        break
      }
      case 'external_link': {
        window.dataLayer?.push({
          event: event.type,
          url: event.url,
          title: event.title,
        })
        break
      }
      case 'details_event': {
        window.dataLayer?.push({
          event: event.type,
          action: event.event,
          poiId: event.poiId,
          title: event.title,
        })
        break
      }
    }
  }
}
