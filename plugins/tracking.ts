import { Plugin, NuxtAppOptions } from '@nuxt/types'
import urlSlug from 'url-slug'

import { Category } from '@/utils/types'

// Also Update README.md according to tracking changes.

type Event =
  | {
      type: 'page'
      title?: string
      location: string
      path: string
    }
  | {
      type: 'category'
      categoryId: Category['id']
      title: string
    }
  | {
      type: 'category_event'
      event: 'enable' | 'filter'
      categoryId: Category['id']
      title: string
    }
  | {
      type: 'search'
    }
  | {
      type: 'search_result_event'
      event: 'select'
      resultType: string
      title: string
    }
  | {
      type: 'popup'
      poiId: string
      title?: string
      location: string
      path: string
    }
  | {
      type: 'popup_event'
      event: 'details' | 'route' | 'explore' | 'favorite' | 'zoom'
      poiId: string
      category: string
      title?: string
    }
  | {
      type: 'map_control_event'
      event: '3d' | 'background' | 'explorer' | 'favorite'
    }
  | {
      type: 'favorites_event'
      event: 'copy_link'
    }

function google(app: NuxtAppOptions, event: Event) {
  switch (event.type) {
    case 'page': {
      app.$gtm.push({
        event: 'pageview',
        pageType: 'PageView',
        pageTitle: event.title,
        pageLocation: event.location,
        pagePath: event.path,
      })
      break
    }
    case 'category': {
      app.$gtm.push({
        event: 'pageview',
        pageType: 'PageView',
        pageTitle: event.title,
        pagePath: `/${urlSlug(event.title)}`,
      })
      break
    }
    case 'category_event': {
      app.$gtm.push({
        event: event.type,
        action: event.event,
        categoryId: event.categoryId,
        title: event.title,
      })
      break
    }
    case 'search': {
      app.$gtm.push({
        event: 'pageview',
        pageType: 'PageView',
        pageTitle: event.type,
        pagePath: `/${urlSlug(event.type)}`,
      })
      break
    }
    case 'search_result_event': {
      app.$gtm.push({
        event: event.type,
        action: event.event,
        type: event.resultType,
        title: event.title,
      })
      break
    }
    case 'popup': {
      app.$gtm.push({
        event: 'pageview',
        pageType: 'PageView',
        pageTitle: event.title,
        pageLocation: event.location,
        pagePath: event.path,
        poiId: event.poiId,
      })
      break
    }
    case 'popup_event': {
      app.$gtm.push({
        event: event.type,
        action: event.event,
        poiId: event.poiId,
        category: event.category,
        title: event.title,
      })
      break
    }
    case 'map_control_event': {
      app.$gtm.push({ event: event.type, action: event.event })
      break
    }
    case 'favorites_event': {
      app.$gtm.push({ event: event.type, action: event.event })
      break
    }
  }
}

const trackingPlugin: Plugin = (
  { app, $config: { GOOGLE_TAG_MANAGER_ID } },
  inject
) => {
  inject('tracking', (event: Event) => {
    if (app.$gtm && GOOGLE_TAG_MANAGER_ID) {
      google(app, event)
    } else if (process.env.NODE_ENV === 'development') {
      console.error('Tracking event', event)
    }
  })
}

export default trackingPlugin

declare module 'vue/types/vue' {
  interface Vue {
    $tracking: (event: Event) => undefined
  }
}
