export interface Article {
  title: string
  url: string
}

export function getSlugFromURL(url: string): string {
  const urlParts = url.split('/')
  return urlParts[urlParts.length - 1].split('.')[0]
}

export async function getArticle(slug: string) {
  const apiEndpoint = useState('api-endpoint')

  const { data, error, status } = await useFetch<string>(
    () => `${apiEndpoint.value}/article/${slug}.html`,
    { method: 'GET' },
  )

  if (error.value) {
    console.error('Fail to fetch article:', error.value)
  }

  return { data, error, status }
}
