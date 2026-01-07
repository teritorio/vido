import type { MultilingualString } from '~/utils/types'
import type { Filters } from '~/types/api/filters'
import type { FieldsList } from '~/lib/apiPois'

export interface ApiMenuItem {
  id: number
  parent_id?: number
  index_order: number
  hidden?: boolean
  selected_by_default?: boolean
}

export interface ApiMenuGroup extends ApiMenuItem {
  menu_group: {
    slug?: string
    name: MultilingualString
    icon: string
    color_fill: string
    color_line?: string
    display_mode: 'large' | 'compact'
  }
}

export interface ApiMenuLink extends ApiMenuItem {
  link: {
    href: string
    slug?: string
    name: MultilingualString
    icon: string
    color_fill: string
    color_line?: string
    display_mode: 'large' | 'compact'
  }
}

export interface ApiMenuCategory extends ApiMenuItem {
  category: {
    slug?: string
    name: MultilingualString
    search_indexed?: boolean
    icon: string
    color_fill: string
    color_line: string
    style_class?: string[]
    style_merge: boolean
    display_mode: 'large' | 'compact'
    zoom: number
    editorial?: {
      popup_fields?: FieldsList
      details_fields?: FieldsList
      list_fields?: FieldsList
      class_label?: MultilingualString
      class_label_popup?: MultilingualString
      class_label_details?: MultilingualString
    }
    filters?: Filters[]
  }
}

export type ApiMenuItemUnion = ApiMenuCategory | ApiMenuGroup | ApiMenuLink

export type ApiMenuCollection = ApiMenuItemUnion[]
