import type { MultilingualString } from '~/utils/types'
import type { Filters } from '~/types/api/filters'

export interface ApiMenuItem {
  id: number
  parent_id: ApiMenuItem['id'] | null
  index_order: number
  hidden?: boolean
  selected_by_default?: boolean
}

export interface ApiMenuGroup extends ApiMenuItem {
  menu_group: {
    id?: number
    name: MultilingualString
    icon: string
    color_fill: string
    color_line: string
    color_text?: '#000000' | '#FFFFFF'
    display_mode: 'large' | 'compact'
  }
  link: undefined
  category: undefined
}

export interface ApiMenuLink extends ApiMenuItem {
  menu_group: undefined
  link: {
    href: string
    name: MultilingualString
    icon: string
    color_fill: string
    color_line: string
    color_text?: '#000000' | '#FFFFFF'
    display_mode: 'large' | 'compact'
  }
  category: undefined
}

export interface ApiMenuCategory extends ApiMenuItem {
  menu_group: undefined
  link: undefined
  category: {
    name: MultilingualString
    icon: string
    color_fill: string
    color_line: string
    color_text?: '#000000' | '#FFFFFF'
    style_class?: string[]
    style_merge: boolean
    display_mode: 'large' | 'compact'
    zoom: number
    filters?: Filters[]
  }
}

export interface MenuGroup extends ApiMenuGroup {
  menu_group: ApiMenuGroup['menu_group'] & {
    vido_children: null | ApiMenuItem['id'][]
  }
}

export type MenuItem = MenuGroup | ApiMenuLink | ApiMenuCategory
