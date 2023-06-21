import { VidoConfig } from '~/utils/types-config'

export type ContentEntry = {
  // eslint-disable-next-line camelcase
  post_id: number
  title: string
  url: string
}

export function getContents(vidoConfig: VidoConfig): Promise<ContentEntry[]> {
  return fetch(
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/articles.json?slug=non-classe`
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as ContentEntry[]
    } else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' '))
      )
    }
  })
}
