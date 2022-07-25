import { MetaInfo } from 'vue-meta'

import { MultilingualString } from '~/utils/types'

export interface SiteInfosTheme {
  id: number
  slug: string
  title: MultilingualString
  description: MultilingualString
  keywords: MultilingualString
  // eslint-disable-next-line camelcase
  site_url: MultilingualString
  // eslint-disable-next-line camelcase
  main_url?: MultilingualString
  // eslint-disable-next-line camelcase
  logo_url: string
  // eslint-disable-next-line camelcase
  favicon_url: string
}

export interface Settings {
  id: number
  slug: string
  name: MultilingualString
  attributions: string[]
  // eslint-disable-next-line camelcase
  icon_font_css_url: string
  // eslint-disable-next-line camelcase
  bbox_line: GeoJSON.LineString
  // eslint-disable-next-line camelcase
  default_country: string
  // eslint-disable-next-line camelcase
  default_country_state_opening_hours: string

  themes: SiteInfosTheme[]
}

export function getSettings(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string
): Promise<Settings> {
  return fetch(`${apiEndpoint}/${apiProject}/${apiTheme}/settings.json`)
    .then((data) => {
      if (data.ok) {
        return data.json() as unknown as Settings
      } else {
        return Promise.reject(
          new Error([data.url, data.status, data.statusText].join(' '))
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
        json
      )
    })
}

export function headerFromSettings(
  settings: Settings,
  options: any = null
): MetaInfo {
  return {
    title: [settings.themes[0].title.fr, options?.title]
      .filter((o) => o)
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
    ].filter((meta) => meta.href),
    meta: [
      {
        // https://nuxtjs.org/docs/2.x/features/meta-tags-seo#local-settings
        hid: 'description',
        name: 'description',
        content: settings.themes[0]?.description?.fr,
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: settings.themes[0]?.keywords?.fr,
      },
    ].filter((meta) => meta.content),
  }
}
