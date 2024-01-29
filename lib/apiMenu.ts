import type { MultilingualString } from '~/utils/types'
import type { VidoConfig } from '~/utils/types-config'

export interface FilterList {
  type: 'multiselection' | 'checkboxes_list'
  property: string
  name: MultilingualString
  values: {
    value: string
    name: MultilingualString
  }[]
}

export interface FilterBoolean {
  type: 'boolean'
  property: string
  name: MultilingualString
}

export interface FilterDate {
  type: 'date_range'

  property_begin: string

  property_end: string
  name: MultilingualString
}

export interface FilterNumberRange {
  type: 'number_range'
  property: string
  name: MultilingualString
  min: number
  max: number
}

export type Filter = FilterList | FilterBoolean | FilterDate | FilterNumberRange

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

    style_class?: string[]

    style_merge: boolean

    display_mode: 'large' | 'compact'
    zoom: number

    filters?: Filter[]
  }
}

export interface MenuGroup extends ApiMenuGroup {

  menu_group: ApiMenuGroup['menu_group'] & {

    vido_children: null | ApiMenuItem['id'][]
  }
}

export type MenuItem = MenuGroup | ApiMenuLink | ApiMenuCategory

export function getMenu(vidoConfig: VidoConfig): Promise<MenuItem[]> {
  return fetch(
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/menu.json`,
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as MenuItem[]
    }
    else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' ')),
      )
    }
  })
}
