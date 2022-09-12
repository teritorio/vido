import { NuxtAppOptions } from '@nuxt/types/app'
import urlSlug from 'url-slug'

import { Event, Tracker } from '~/lib/trackers'

export default class Google implements Tracker {
  waitForConsent: boolean
  gtm: any
  googleTagManagerId: string

  constructor(waitForConsent: boolean, gtm: any, googleTagManagerId: string) {
    this.waitForConsent = waitForConsent
    this.gtm = gtm
    this.googleTagManagerId = googleTagManagerId
    if (!waitForConsent) {
      this.gtm.init(googleTagManagerId)
    }
  }

  consent(app: NuxtAppOptions) {
    if (this.waitForConsent) {
      this.gtm.init(this.googleTagManagerId)
    }
  }

  track(event: Event) {
    switch (event.type) {
      case 'page': {
        this.gtm.push({
          event: 'pageview',
          pageType: 'PageView',
          pageTitle: event.title,
          pageLocation: event.location,
          pagePath: event.path,
          origin: event.origin,
        })
        break
      }
      case 'category': {
        this.gtm.push({
          event: 'pageview',
          pageType: 'PageView',
          pageTitle: event.title,
          pagePath: `/${urlSlug(event.title)}-${event.categoryId}/`,
        })
        break
      }
      case 'category_event': {
        this.gtm.push({
          event: event.type,
          action: event.event,
          categoryId: event.categoryId,
          title: event.title,
        })
        break
      }
      case 'notebook_event':
      case 'search': {
        this.gtm.push({
          event: 'pageview',
          pageType: 'PageView',
          pageTitle: event.type,
          pagePath: `/${urlSlug(event.type)}`,
        })
        break
      }
      // case 'search_query': {}
      case 'search_result_event': {
        this.gtm.push({
          event: event.type,
          action: event.event,
          type: event.resultType,
          title: event.title,
        })
        break
      }
      case 'popup': {
        this.gtm.push({
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
        this.gtm.push({
          event: event.type,
          action: event.event,
          poiId: event.poiId,
          category: event.category,
          title: event.title,
        })
        break
      }
      case 'map_control_event': {
        this.gtm.push({ event: event.type, action: event.event })
        break
      }
      case 'favorites_event': {
        this.gtm.push({ event: event.type, action: event.event })
        break
      }
      case 'external_link': {
        this.gtm.push({ event: event.type, url: event.url, title: event.title })
        break
      }
      case 'details_event': {
        this.gtm.push({
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
