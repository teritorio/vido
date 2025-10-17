import type { MetaObject } from 'nuxt/schema'
import type { MultilingualString } from '~/utils/types'

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
  isochroneEnabled: boolean
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

function stripHTML(value?: string): string | undefined {
  if (value)
    return value.replace(/(<([^>]+)>)/g, '')
}

export function headerFromSettings(
  theme: SiteInfosTheme,
  iconFontUrl: string,
  options:
    | { title?: string, description?: any, googleSiteVerification?: string }
    | undefined = undefined,
): MetaObject {
  return {
    htmlAttrs: {
      lang: 'fr',
    },
    title: [theme.title.fr, options?.title]
      .filter(o => o)
      .join(' - '),
    link: [
      {
        rel: 'stylesheet',
        href: iconFontUrl,
      },
      {
        hid: 'icon',
        rel: 'icon',
        type: 'image/x-icon',
        href: theme.favicon_url || '',
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
            options?.description?.fr || theme.description?.fr || '',
          ) || '',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: theme.keywords?.fr,
      },
      {
        hid: 'google-site-verification',
        name: 'google-site-verification',
        content: options?.googleSiteVerification,
      },
    ].filter(meta => meta.content),
  }
}
