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
  isochrone: boolean
  matomo_url: string
  matomo_siteid: string
  map_style_base_url: string
  map_bicycle_style_url: string
  map_style_satellite_url: string
  cookies_consent_message: MultilingualString
  cookies_usage_detail_url: string
  google_site_verification: string
  google_tag_manager_id: string
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
  themes: Record<string, SiteInfosTheme>
  image_proxy_hosts: string[]
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
        content: theme.google_site_verification,
      },
    ].filter(meta => meta.content),
  }
}
