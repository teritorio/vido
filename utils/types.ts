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
  raster = 'raster',
  aerial = 'aerial',
  bicycle = 'bicycle',
}

export enum OriginEnum {
  // eslint-disable-next-line camelcase
  link_share = 'link_share',
  // eslint-disable-next-line camelcase
  qr_code = 'qr_code',
  facebook = 'facebook',
  twitter = 'twitter',
  whatsapp = 'whatsapp',
}
