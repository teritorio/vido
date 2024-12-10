import type { App } from 'nuxt/dist/app/compat/vue-demi'
import urlSlug from 'url-slug'
import VueMatomo from 'vue-matomo'

import type { Event, Tracker } from '~/lib/trackers'

export default class Matomo implements Tracker {
  constructor(app: App, waitForConsent: boolean, url: string, siteId: string) {
    app.use(VueMatomo, {
      host: url,
      siteId,
      requireConsent: waitForConsent,
      requireCookieConsent: waitForConsent,
      /** Other configuration options */
    })
  }

  consent(_app: App) {
    let delai = 1000

    const timeout = () => {
      setTimeout(() => {
        // eslint-disable-next-line ts/no-use-before-define
        set()
      }, delai)
      delai = delai * 2
    }

    const set = () => {
      if (window.Matomo && window.Matomo.getAsyncTracker()) {
        window.Matomo.getAsyncTracker().setConsentGiven()
        window.Matomo.getAsyncTracker().setCookieConsentGiven()
      }
      else {
        timeout()
      }
    }

    set()
  }

  track(_app: App, event: Event) {
    const _paq = window._paq
    switch (event.type) {
      case 'page': {
        // event.location,
        _paq.push(['setCustomDimension', 1, event.origin])
        _paq.push(['setCustomUrl', event.path])
        _paq.push(['trackPageView', event.title])
        break
      }
      case 'menu': {
        _paq.push([
          'setCustomUrl',
          `/${urlSlug(event.title)}-${event.menuItemId}/`,
        ])
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
        // event.location,
        // event.path,
        // categoryIds: event.categoryIds,
        _paq.push(['setCustomUrl', `/${event.title}-${event.poiId}`])
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
        const eventParams = [
          'trackEvent',
          // category
          event.type,
          // action
          event.event,
        ]

        if (event.event === 'background') {
          eventParams.push('background')
          eventParams.push(event.background)
        }

        _paq.push(eventParams)
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
      case 'details_event': {
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
      case 'isochrone_event': {
        _paq.push([
          'trackEvent',
          // category
          event.type,
          // action
          event.event,
          // name
          'profile',
          // value
          event.profile,
        ])
        break
      }
    }
  }
}
