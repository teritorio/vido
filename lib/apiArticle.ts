import type { VidoConfig } from '~/utils/types-config'

export interface Article {
  title: string
  url: string
}

export function getSlugFromURL(url: string): string {
  const urlParts = url.split('/')
  return urlParts[urlParts.length - 1].split('.')[0]
}

export async function getArticles(config: VidoConfig) {
  // HINT: slug query param is here only for WP API backward compatibility
  const { data, error, status } = await useFetch<Article[]>(
    () => `${config.API_ENDPOINT}/${config.API_PROJECT}/${config.API_THEME}/articles.json?slug=non-classe`,
    {
      method: 'GET',
    },
  )

  if (error.value) {
    console.error('Fail to fetch articles:', error.value)
  }

  return { data, error, status }
}

export async function getArticle(config: VidoConfig, slug: string) {
  const { data, error, status } = await useFetch<string>(
    () => `${config.API_ENDPOINT}/${config.API_PROJECT}/${config.API_THEME}/article/${slug}.html`,
    { method: 'GET' },
  )

  if (error.value) {
    console.error('Fail to fetch article:', error.value)
  }

  return { data, error, status }
}
