import type { ApiPoiProperties } from '~/types/api/poi'
import type { LanguageCode } from '~/utils/types'

export interface ApiPoiDepsProperties extends Omit<ApiPoiProperties, 'route'> {
  id: number
  route: ApiPoiDepsPropertiesRoute
  description?: {
    [lang in LanguageCode]?: {
      value: string
      html: boolean
      is_shortened: boolean
    }
  }
}

export type ApiPoiDepsPropertiesRoute = {
  [lang in LanguageCode]?: {
    waypoint?: {
      type: 'parking' | 'start' | 'end' | 'waypoint'
    }
  }
}

export type ApiPoiDeps = GeoJSON.Feature<GeoJSON.Geometry, ApiPoiDepsProperties>

export type ApiPoiDepsResponse = GeoJSON.FeatureCollection<GeoJSON.Geometry, ApiPoiDepsProperties>
