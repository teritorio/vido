export interface LatLng {
  lat: number
  lng: number
}

export type ZoomLevel = number
export type Pitch = number

export interface CategoryMetadata {
  label: { [lang: string]: string }
  slug?: { [lang: string]: string }
  color?: string // Inherited from its parent by default
  picto?: string // Inherited from its parent by default
}

export interface CategoryBase {
  id: string
  level: 1 | 2 | 3
  metadata: CategoryMetadata
  order?: number
  parents?: {
    [className: string]: {
      id: string
      order: number
      metadata?: CategoryMetadata // Inherited from its parent by default
    }
  }
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

export interface Categories {
  [lang: string]: Category
}
