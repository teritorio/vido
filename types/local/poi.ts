import type { ApiMenuCategory } from '~/types/api/menu'
import type { ApiPoi, ApiPoiProperties, ApiPoiPropertiesDisplay, ApiPoiPropertiesEditorial, TextColors } from '~/types/api/poi'

export interface Poi extends ApiPoi {
  properties: ApiPoiProperties & {
    display: ApiPoiPropertiesDisplay & {
      color_fill: string
      color_line: string
      color_text: TextColors
      text?: string
      icon: ApiMenuCategory['category']['icon']
      style_class?: ApiMenuCategory['category']['style_class']
    }
    editorial: ApiPoiPropertiesEditorial & ApiMenuCategory['category']['editorial']
    vido_visible?: boolean
    vido_cat?: number
    vido_zoom?: number
  }
}
