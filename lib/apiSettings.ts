import { MetaInfo } from 'vue-meta'

import { MultilingualString } from '~/utils/types'

export interface SiteInfosTheme {
  id: number
  slug: string
  title: MultilingualString
  description: MultilingualString
  // eslint-disable-next-line camelcase
  site_url: MultilingualString
  // eslint-disable-next-line camelcase
  main_url: MultilingualString
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

  themes: SiteInfosTheme[]
}

export function getSettings(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string
): Promise<Settings | null> {
  return fetch(`${apiEndpoint}/${apiProject}/${apiTheme}`)
    .then((res) => res.json())
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
  settings: Settings | null,
  options: any = null
): MetaInfo {
  return {
    title: [settings?.themes[0].title.fr, options?.title]
      .filter((o) => o)
      .join(' - '),
    link: [
      {
        rel: 'stylesheet',
        href: settings?.icon_font_css_url || '',
      },
      {
        rel: 'icon',
        href: settings?.themes[0].favicon_url || '',
      },
    ],
  }
}
