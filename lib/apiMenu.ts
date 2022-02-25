import { MultilingualString } from '@/utils/types'

export type FilterList = {
  type: 'multiselection' | 'checkboxes_list'
  property: string
  name: MultilingualString
  values: {
    value: string
    name: MultilingualString[]
  }
}

export type FilterBoolean = {
  type: 'boolean'
  property: string
  name: MultilingualString
}

export type Filter = FilterList | FilterBoolean

export interface ApiMenuItem {
  id: number
  // eslint-disable-next-line camelcase
  parent_id: ApiMenuItem['id'] | null
  // eslint-disable-next-line camelcase
  index_order: number
  hidden: boolean
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
  menu_group: ApiMenuGroup['menu_group'] & {
    // eslint-disable-next-line camelcase
    vido_children: null | ApiMenuItem['id'][]
  }
}

export type Category = MenuGroup | ApiMenuCategory

export function getMenu(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string
): Promise<[Category] | null> {
  return fetch(`${apiEndpoint}/${apiProject}/${apiTheme}/menu`).then((data) =>
    data.ok ? ((data.json() as unknown) as [Category]) : null
  )
}
