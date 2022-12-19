import fetch from 'node-fetch'

export type ContentEntry = {
  // eslint-disable-next-line camelcase
  post_id: number
  title: string
  url: string
}

export function getContents(
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string
): Promise<ContentEntry[]> {
  return fetch(
    `${apiEndpoint}/${apiProject}/${apiTheme}/articles.json?slug=non-classe`
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
