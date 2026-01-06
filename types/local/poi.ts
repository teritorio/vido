import type { ApiMenuCategory } from '~/types/api/menu'
import type { ApiPoi, ApiPoiProperties, ApiPoiPropertiesDisplay, ApiPoiPropertiesEditorial } from '~/types/api/poi'

export interface Poi extends ApiPoi {
  properties: ApiPoiProperties & {
    display: ApiPoiPropertiesDisplay & {
      icon: ApiMenuCategory['category']['icon']
      style_class?: ApiMenuCategory['category']['style_class']
    }
    editorial: ApiPoiPropertiesEditorial & ApiMenuCategory['category']['editorial']
    vido_visible?: boolean
    vido_cat?: number
  }
}
