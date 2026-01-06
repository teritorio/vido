import type { ApiMenuCategory } from '~/types/api/menu'
import type { ApiPoiProperties, ApiPoiPropertiesDisplay, ApiPoiPropertiesEditorial, ApiPoiResponse } from '~/types/api/poi'

export interface Poi extends ApiPoiResponse {
  properties: ApiPoiProperties & {
    display: ApiPoiPropertiesDisplay & {
      icon: ApiMenuCategory['category']['icon']
      style_class?: ApiMenuCategory['category']['style_class']
    }
    editorial: ApiPoiPropertiesEditorial & ApiMenuCategory['category']['editorial']
  }
}
