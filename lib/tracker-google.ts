import urlSlug from 'url-slug'

import { Event, Tracker } from '@/lib/trackers'

export default class Google implements Tracker {
  gtm: any

  constructor(gtm: any, googleTagManagerId: string) {
    this.gtm = gtm
    gtm.init(googleTagManagerId)
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
          pagePath: `/${urlSlug(event.title)}`,
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
          pagePath: event.path,
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
