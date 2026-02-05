import type { ApiMenuCategory } from '~/types/api/menu'
import type { ApiPoi, ApiPoiProperties, ApiPoiPropertiesDisplay, ApiPoiPropertiesEditorial, TextColors } from '~/types/api/poi'
import type { MenuCategoryEditorial } from '~/types/local/menu'

export interface Poi extends Omit<ApiPoi, 'properties'> {
  properties: Omit<ApiPoiProperties, 'display' | 'editorial'> & {
    display: Omit<ApiPoiPropertiesDisplay, 'color_fill' | 'color_line' | 'color_text'> & {
      color_fill: string
      color_line: string
      color_text: TextColors
      text?: string
      icon: ApiMenuCategory['category']['icon']
      icon_show: boolean
      style_class?: ApiMenuCategory['category']['style_class']
    }
    editorial: ApiPoiPropertiesEditorial & MenuCategoryEditorial
    vido_visible?: boolean
    vido_cat?: number
    vido_zoom?: number
  }
}
