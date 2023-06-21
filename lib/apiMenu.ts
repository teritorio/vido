import { MultilingualString } from '~/utils/types'
import { VidoConfig } from '~/utils/types-config'

export type FilterList = {
  type: 'multiselection' | 'checkboxes_list'
  property: string
  name: MultilingualString
  values: {
    value: string
    name: MultilingualString
  }[]
}

export type FilterBoolean = {
  type: 'boolean'
  property: string
  name: MultilingualString
}

export type FilterDate = {
  type: 'date_range'
  // eslint-disable-next-line camelcase
  property_begin: string
  // eslint-disable-next-line camelcase
  property_end: string
  name: MultilingualString
}

export type FilterNumberRange = {
  type: 'number_range'
  property: string
  name: MultilingualString
  min: number
  max: number
}

export type Filter = FilterList | FilterBoolean | FilterDate | FilterNumberRange

export interface ApiMenuItem {
  id: number
  // eslint-disable-next-line camelcase
  parent_id: ApiMenuItem['id'] | null
  // eslint-disable-next-line camelcase
  index_order: number
  hidden?: boolean
  // eslint-disable-next-line camelcase
  selected_by_default?: boolean
}

export interface ApiMenuGroup extends ApiMenuItem {
  // eslint-disable-next-line camelcase
  menu_group: {
    name: MultilingualString
    icon: string
    // eslint-disable-next-line camelcase
    color_fill: string
    // eslint-disable-next-line camelcase
    color_line: string
    // eslint-disable-next-line camelcase
    style_class?: string[]
    // eslint-disable-next-line camelcase
    display_mode: 'large' | 'compact'
  }
  link: undefined
  category: undefined
}

export interface ApiMenuLink extends ApiMenuItem {
  // eslint-disable-next-line camelcase
  menu_group: undefined
  link: {
    href: string
    name: MultilingualString
    icon: string
    // eslint-disable-next-line camelcase
    color_fill: string
    // eslint-disable-next-line camelcase
    color_line: string
    // eslint-disable-next-line camelcase
    display_mode: 'large' | 'compact'
  }
  category: undefined
}

export interface ApiMenuCategory extends ApiMenuItem {
  // eslint-disable-next-line camelcase
  menu_group: undefined
  link: undefined
  category: {
    name: MultilingualString
    icon: string
    // eslint-disable-next-line camelcase
    color_fill: string
    // eslint-disable-next-line camelcase
    color_line: string
    // eslint-disable-next-line camelcase
    style_class: string[]
    // eslint-disable-next-line camelcase
    style_merge: boolean
    // eslint-disable-next-line camelcase
    display_mode: 'large' | 'compact'
    zoom: number

    filters?: Filter[]
  }
}

export interface MenuGroup extends ApiMenuGroup {
  // eslint-disable-next-line camelcase
  menu_group: ApiMenuGroup['menu_group'] & {
    // eslint-disable-next-line camelcase
    vido_children: null | ApiMenuItem['id'][]
  }
}

export type MenuItem = MenuGroup | ApiMenuLink | ApiMenuCategory

export function getMenu(vidoConfig: VidoConfig): Promise<MenuItem[]> {
  return fetch(
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/menu.json`
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as MenuItem[]
    } else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' '))
      )
    }
  })
}
