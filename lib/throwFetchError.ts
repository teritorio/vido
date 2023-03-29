import { AsyncData } from 'nuxt/app'

export function throwFetchError(
  asyncDatas: AsyncData<any, Error | null>[]
): void {
  asyncDatas
    .filter((asyncData) => asyncData.error.value)
    .forEach((asyncData) => {
      throw asyncData.error.value
    })
}
