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
  level: number // 1, 2, 3
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

export type Category = CategoryBase & SuperCategory

export interface Categories {
  [lang: string]: Category
}
