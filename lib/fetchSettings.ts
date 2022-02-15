import { MetaInfo } from 'vue-meta'

import { Settings } from '~/utils/types'

export function fetchSettings(config: any): Promise<Settings | null> {
  return fetch(
    `${config.API_ENDPOINT}/${config.API_PROJECT}/${config.API_THEME}`
  )
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
