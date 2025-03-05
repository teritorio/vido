import type { Ref } from 'vue'
import type { FetchError } from 'ofetch'
// TODO: update Nuxt to be able to import from #app
import type { AsyncDataRequestStatus } from 'nuxt/dist/app/composables/asyncData'
import type { VidoConfig } from '~/utils/types-config'

export interface Article {
  title: string
  url: string
}

function _getSlugFromURL(url: string): string {
  const urlParts = url.split('/')
  return urlParts[urlParts.length - 1].split('.')[0]
}

export async function getArticles(config: VidoConfig): Promise<{
  data: Ref<Article[] | null>
  error: Ref<FetchError<any> | null>
  status: Ref<AsyncDataRequestStatus>
}> {
  // HINT: slug query param is here only for WP API backward compatibility
  const { data, error, status } = await useFetch<Article[]>(
    () => `${config.API_ENDPOINT}/${config.API_PROJECT}/${config.API_THEME}/articles.json?slug=non-classe`,
    {
      method: 'GET',
      transform: (articles) => {
        return articles.map(article => ({
          ...article,
          url: _getSlugFromURL(article.url),
        }))
      },
    },
  )

  if (error.value) {
    console.error('Fail to fetch articles:', error.value)
  }

  return { data, error, status }
}

export async function getArticle(config: VidoConfig, slug: string): Promise<{
  data: Ref<string | null>
  error: Ref<FetchError<any> | null>
  status: Ref<AsyncDataRequestStatus>
}> {
  const { data, error, status } = await useFetch<string>(
    () => `${config.API_ENDPOINT}/${config.API_PROJECT}/${config.API_THEME}/article/${slug}.html`,
    { method: 'GET' },
  )

  if (error.value) {
    console.error('Fail to fetch article:', error.value)
  }

  return { data, error, status }
}
