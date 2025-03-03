import type { VidoConfig } from '~/utils/types-config'

export interface Article {
  title: string
  url: string
}

export async function getArticles(vidoConfig: VidoConfig): Promise<Article[]> {
  return await fetch(
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/articles.json?slug=non-classe`,
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as Article[]
    }
    else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' ')),
      )
    }
  })
}

export async function getArticle(url: string): Promise<Article[]> {
  return await fetch(url).then((data) => {
    if (data.ok) {
      return data.json() as unknown as Article[]
    }
    else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' ')),
      )
    }
  })
}
