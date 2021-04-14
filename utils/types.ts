export interface LatLng {
  lat: number
  lng: number
}

export type ZoomLevel = number
export type Pitch = number

export type PoiType = 'tis' | 'osm' | 'zone'

export interface ApiCategoryBase {
  id: string
  parent: string
  level: 1 | 2 | 3
  metadata: {
    color: string
    count: string
    description: { [lang: string]: string }
    hide: boolean
    label: { [lang: string]: string }
    picto: string
  }
  order: string
  datasources: {
    idsrc: string
    // eslint-disable-next-line camelcase
    poi_type: PoiType
    slug: string
  }
}

export type CategoryBase = ApiCategoryBase & {
  metadata: {
    count: number
  }
  order: number
}

// Only first level classes can be highlighted
export interface SuperCategory extends CategoryBase {
  highlighted: boolean
  level: 1
}

export interface MidCategory extends CategoryBase {
  level: 2
}

export interface SubCategory extends CategoryBase {
  level: 3
}

export type Category = CategoryBase &
  (SuperCategory | MidCategory | SubCategory)

export interface SiteInfos {
  [lang: string]: {
    name: string
    description: string
    logo: string
  }
}
