import { MultilingualString } from '@/utils/types'

export type Filter = {
  type: 'multiselection' | 'checkboxes_list' | 'boolean'
  property: MultilingualString
  label: MultilingualString
  values: {
    value: string
    name: MultilingualString[]
  }
}

export interface ApiMenuItem {
  id: number
  // eslint-disable-next-line camelcase
  parent_id: ApiMenuItem['id'] | null
  // eslint-disable-next-line camelcase
  index_order: number
  hidden: boolean
  // eslint-disable-next-line camelcase
  selected_by_default: boolean
  // eslint-disable-next-line camelcase
}

export interface ApiMenuGroup extends ApiMenuItem {
  // eslint-disable-next-line camelcase
  menu_group: {
    name: MultilingualString
    icon: string
    color: string
    // eslint-disable-next-line camelcase
    tourism_style_class: string[]
    // eslint-disable-next-line camelcase
    display_mode: 'large' | 'compact'
  }
  category: undefined
}

export interface ApiMenuCategory extends ApiMenuItem {
  // eslint-disable-next-line camelcase
  menu_group: undefined
  category: {
    name: MultilingualString
    icon: string
    color: string
    // eslint-disable-next-line camelcase
    tourism_style_class: string[]
    // eslint-disable-next-line camelcase
    tourism_style_merge: boolean
    // eslint-disable-next-line camelcase
    display_mode: 'large' | 'compact'
    zoom: number

    filters?: Filter[]
  }
}

export interface MenuGroup extends ApiMenuGroup {
  // eslint-disable-next-line camelcase
  vido_children: null | ApiMenuItem['id'][]
  highlighted: boolean
}

export interface MenuCategory extends ApiMenuCategory {
  // eslint-disable-next-line camelcase
  vido_children: null | ApiMenuItem['id'][]
  highlighted: boolean
}

export type Category = MenuGroup | MenuCategory

export function getMenu(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string
): Promise<[Category] | null> {
  return fetch(`${apiEndpoint}/${apiProject}/${apiTheme}/menu`).then((data) =>
    data.ok ? ((data.json() as unknown) as [Category]) : null
  )
}
