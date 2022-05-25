import urlSlug from 'url-slug'
import Vue from 'vue'
// @ts-ignore
import VueMatomo from 'vue-matomo'

import { Event, Tracker } from '@/lib/trackers'

export default class Matomo implements Tracker {
  constructor(url: string, siteId: string) {
    Vue.use(VueMatomo, {
      host: url,
      siteId,
      /** Other configuration options **/
    })
  }

  track(event: Event) {
    // @ts-ignore
    const _paq = window._paq
    switch (event.type) {
      case 'page': {
        // pagePath: event.path,
        _paq.push(['setCustomDimension', 1, event.origin])
        _paq.push(['setCustomUrl', event.location])
        _paq.push(['trackPageView', event.title])
        break
      }
      case 'category': {
        _paq.push(['setCustomUrl', `/${urlSlug(event.title)}`])
        _paq.push(['trackPageView', event.title])
        break
      }
      case 'category_event': {
        _paq.push([
          'trackEvent',
          // category
          event.type,
          // action
          event.event,
          // name
          event.title,
          // value
          event.categoryId,
        ])
        break
      }
      case 'notebook_event':
      case 'search': {
        _paq.push(['setCustomUrl', `/${urlSlug(event.type)}`])
        _paq.push(['trackPageView', event.type])
        break
      }
      case 'search_query': {
        _paq.push(['trackSiteSearch', event.query])
        break
      }
      case 'search_result_event': {
        _paq.push([
          'trackEvent',
          // category
          event.type,
          // action
          event.event,
          // name
          event.title,
          // value
          event.resultType,
        ])
        break
      }
      case 'popup': {
        // pagePath: event.path,
        // poiId: event.poiId,
        // categoryIds: event.categoryIds,
        _paq.push(['setCustomUrl', event.location])
        _paq.push(['trackPageView', event.title])
        break
      }
      case 'popup_event': {
        // category: event.category,
        _paq.push([
          'trackEvent',
          // category
          event.type,
          // action
          event.event,
          // name
          event.title,
          // value
          event.poiId,
        ])
        break
      }
      case 'map_control_event': {
        _paq.push([
          'trackEvent',
          // category
          event.type,
          // action
          event.event,
        ])
        break
      }
      case 'favorites_event': {
        _paq.push([
          'trackEvent',
          // category
          event.type,
          // action
          event.event,
        ])
        break
      }
      case 'external_link': {
        _paq.push([
          'trackLink',
          // url
          event.url,
          // event.title,
        ])
        break
      }
    }
  }
}
