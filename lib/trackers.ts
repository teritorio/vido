import type { App } from 'nuxt/dist/app/compat/vue-demi'

import type { ApiPoiId } from './apiPois'

import type { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import type { OriginEnum } from '~/utils/types'

// Also Update README.md according to tracking changes.

export type Event =
  | {
    type: 'page'
    title?: string
    location: string
    path: string
    origin: OriginEnum
  }
  | {
    type: 'menu'
    menuItemId: MenuItem['id']
    title: string
  }
  | {
    type: 'category_event'
    event: 'enable' | 'filter'
    categoryId: ApiMenuCategory['id']
    title: string
  }
  | {
    type: 'search'
  }
  | {
    type: 'search_query'
    query: string
  }
  | {
    type: 'search_result_event'
    event: 'select'
    resultType: string
    title: string
  }
  | {
    type: 'popup'
    poiId: ApiPoiId
    title?: string
    location: string
    path: string
    categoryIds: Array<number>
  }
  | {
    type: 'popup_event'
    event: 'details' | 'route' | 'explore' | 'favorite' | 'zoom'
    poiId: ApiPoiId
    category: string
    title?: string
  }
  | {
    type: 'map_control_event'
    event: '3d' | 'background' | 'explorer' | 'favorite'
  }
  | {
    type: 'favorites_event'
    event: 'open_share' | 'copy_link' | 'export_pdf' | 'export_csv'
  }
  | {
    type: 'notebook_event'
    event: 'open'
  }
  | {
    type: 'external_link'
    title: string
    url: string
  }
  | {
    type: 'details_event'
    event: 'favorite'
    poiId: ApiPoiId
    title?: string
  }

export interface Tracker {
  consent(app: App): void
  track(app: App, event: Event): void
}
