import type { ApiMenuCategory, ApiMenuGroup, ApiMenuLink } from '~/types/api/menu'

export interface MenuGroup extends ApiMenuGroup {
  menu_group: ApiMenuGroup['menu_group'] & {
    vido_children: number[]
  }
}

export type MenuItem = MenuGroup | ApiMenuLink | ApiMenuCategory
