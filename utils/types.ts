export interface LatLng {
  lat: number
  lng: number
}

export type ZoomLevel = number
export type Pitch = number

export interface ClassMetadata {
  label: { [lang: string]: string }
  slug?: { [lang: string]: string }
  color?: string // Inherited from its parent by default
  picto?: string // Inherited from its parent by default
}

export interface ClassBase {
  id: string
  level: number // 1, 2, 3
  metadata: ClassMetadata
  order?: number
  parents?: {
    [className: string]: {
      id: string
      order: number
      metadata?: ClassMetadata // Inherited from its parent by default
    }
  }
}

// Only first level classes can be highlighted
export interface FirstLevelClass extends ClassBase {
  highlighted: boolean
  level: 1
}

export type Class = ClassBase & FirstLevelClass

export interface Classes {
  [lang: string]: Class
}
