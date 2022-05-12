import { Category } from '@/lib/apiMenu'

// Also Update README.md according to tracking changes.

export type Event =
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
      poiId: number
      title?: string
      location: string
      path: string
      categoryIds: Array<Number>
    }
  | {
      type: 'popup_event'
      event: 'details' | 'route' | 'explore' | 'favorite' | 'zoom'
      poiId: number
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

export interface Tracker {
  track(event: Event): void
}
