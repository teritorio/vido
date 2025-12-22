export interface MultilingualString {
  [lang: string]: string
}

export interface LatLng {
  lat: number
  lng: number
}

/** [lat, lng] */
export type TupleLatLng = [number, number]

export type ZoomLevel = number
export type Pitch = number

export enum Mode {
  BROWSER = 'browser', // User browses by category
  EXPLORER = 'explorer', // User explores around
  FAVORITES = 'favorites', // User favorites
}

export enum MapStyleEnum {
  vector = 'vector',
  aerial = 'aerial',
  bicycle = 'bicycle',
}

export enum OriginEnum {
  link_share = 'link_share',
  qr_code = 'qr_code',
  facebook = 'facebook',
  twitter = 'twitter',
  whatsapp = 'whatsapp',
}

export enum StarsEnum {
  One = '1',
  OneS = '1S',
  Two = '2',
  TwoS = '2S',
  Three = '3',
  ThreeS = '3S',
  Four = '4',
  FourS = '4S',
  Five = '5',
  FiveS = '5S',
}

export enum DateFilterLabel {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEKEND = 'thisWeekend',
  NEXT_WEEK = 'nextWeek',
  NEXT_MONTH = 'nextMonth',
}

export interface DateFilterOption {
  title: string
  value: string
  begin: string
  end: string
}

export const assocRenderKey = {
  'osm:opening_hours': 'opening_hours',
  'osm:collection_times': 'collection_times',
  'osm:opening_hours+values': 'lit',
} as const

export type AssocRenderKey = keyof typeof assocRenderKey
export type AssocRenderValue = typeof assocRenderKey[AssocRenderKey]
export const AssocRenderKeys = Object.keys(assocRenderKey) as AssocRenderKey[]
