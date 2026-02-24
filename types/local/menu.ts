import type { ApiMenuCategory, ApiMenuGroup, ApiMenuLink } from '~/types/api/menu'
import type { MultilingualString } from '~/utils/types'
import type { FieldsList } from '~/types/local/field'

export interface MenuGroup extends Omit<ApiMenuGroup, 'menu_group'> {
  menu_group: ApiMenuGroup['menu_group'] & {
    vido_children: number[]
  }
}

export interface MenuCategoryEditorial {
  popup_fields?: FieldsList
  details_fields?: FieldsList
  list_fields?: FieldsList
  class_label?: MultilingualString
  class_label_popup?: MultilingualString
  class_label_details?: MultilingualString
}

export interface MenuCategory extends Omit<ApiMenuCategory, 'category'> {
  category: Omit<ApiMenuCategory['category'], 'editorial'> & {
    editorial?: MenuCategoryEditorial
  }
}

export type MenuItem = MenuGroup | ApiMenuLink | MenuCategory
