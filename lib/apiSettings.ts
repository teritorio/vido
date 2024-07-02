import type { MetaObject } from 'nuxt/schema'

import type { MultilingualString } from '~/utils/types'
import type { VidoConfig } from '~/utils/types-config'

export interface SiteInfosTheme {
  id: number
  slug: string
  title: MultilingualString
  description: MultilingualString
  keywords: MultilingualString

  site_url: MultilingualString

  main_url?: MultilingualString

  logo_url: string

  favicon_url: string

  favorites_mode: boolean

  explorer_mode: boolean
}

export interface Settings {
  id: number
  slug: string
  name: MultilingualString
  attributions: string[]

  icon_font_css_url: string
  polygon: {
    type: 'geojson'
    data: GeoJSON.Polygon
  }
  polygons_extra?: {
    [key: string]: {
      type: 'geojson'
      data: string | GeoJSON.Polygon
    }
  }

  bbox_line: GeoJSON.LineString

  default_country: string

  default_country_state_opening_hours: string

  themes: SiteInfosTheme[]
}

export async function getSettings(vidoConfig: VidoConfig): Promise<Settings> {
  return await fetch(
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/settings.json`,
  )
    .then((data) => {
      if (data.ok) {
        return data.json() as unknown as Settings
      }
      else {
        return Promise.reject(
          new Error([data.url, data.status, data.statusText].join(' ')),
        )
      }
    })
    .then((json: Settings) => {
      return Object.assign(
        {
          id: 0,
          slug: '',
          name: '',
          attribution: [],
          icon_font_css_url: '',
          bbox_line: {
            type: 'LineString',
            coordinates: [
              [1.43862, 42.41845],
              [1.68279, 42.6775],
            ],
          },
          themes: [],
        },
        json,
      )
    })
}

function stripHTML(value?: string): string | undefined {
  if (value)
    return value.replace(/(<([^>]+)>)/g, '')
}

export function headerFromSettings(
  settings: Settings,
  options:
    | { title?: string, description?: any, googleSiteVerification?: string }
    | undefined = undefined,
): MetaObject {
  return {
    htmlAttrs: {
      lang: 'fr',
    },
    title: [settings.themes[0].title.fr, options?.title]
      .filter(o => o)
      .join(' - '),
    link: [
      {
        rel: 'stylesheet',
        href: settings.icon_font_css_url,
      },
      {
        hid: 'icon',
        rel: 'icon',
        type: 'image/x-icon',
        href: settings.themes[0].favicon_url,
      },
      {
        rel: 'manifest',
        href: '/manifest.webmanifest',
      },
    ].filter(meta => meta.href),
    meta: [
      {
        // https://nuxtjs.org/docs/2.x/features/meta-tags-seo#local-settings
        hid: 'description',
        name: 'description',
        content:
          stripHTML(
            options?.description?.fr || settings.themes[0]?.description?.fr,
          ) || '',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: settings.themes[0]?.keywords?.fr,
      },
      {
        hid: 'google-site-verification',
        name: 'google-site-verification',
        content: options?.googleSiteVerification,
      },
    ].filter(meta => meta.content),
  }
}
