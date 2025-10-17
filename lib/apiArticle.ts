import type { Ref } from 'vue'
import type { FetchError } from 'ofetch'
// TODO: update Nuxt to be able to import from #app
import type { AsyncDataRequestStatus } from 'nuxt/dist/app/composables/asyncData'
import type { VidoConfig } from '~/utils/types-config'

export interface Article {
  title: string
  url: string
}

export function getSlugFromURL(url: string): string {
  const urlParts = url.split('/')
  return urlParts[urlParts.length - 1].split('.')[0]
}

export async function getArticle(config: VidoConfig, slug: string): Promise<{
  data: Ref<string | null>
  error: Ref<FetchError<any> | null>
  status: Ref<AsyncDataRequestStatus>
}> {
  const { apiEndpoint } = useApiEndpoint()
  const { data, error, status } = await useFetch<string>(
    () => `${apiEndpoint.value}/${config.API_PROJECT}/${config.API_THEME}/article/${slug}.html`,
    { method: 'GET' },
  )

  if (error.value) {
    console.error('Fail to fetch article:', error.value)
  }

  return { data, error, status }
}
