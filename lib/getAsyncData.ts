import type { AsyncDataOptions } from 'nuxt/app'
import type {
  KeyOfRes,
  PickFrom,
  _Transform,
} from 'nuxt/dist/app/composables/asyncData'
import type { NuxtApp } from 'nuxt/dist/app/nuxt'
import type { Ref } from 'vue'
import { ref } from 'vue'

import { useAsyncData } from '#imports'

export async function getAsyncDataOrThrows<
  DataT,
  _DataE = Error,
  Transform extends _Transform<DataT> = _Transform<DataT, DataT>,
  PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
>(
  key: string,
  handler: (ctx?: NuxtApp) => Promise<DataT>,
  options?: AsyncDataOptions<DataT, Transform>,
): Promise<Ref<PickFrom<ReturnType<Transform>, PickKeys>>> {
  return useAsyncData(key, handler, options).then(({ data, error }) => {
    if (error != null && error.value)
      throw error
    else
      return data as Ref<PickFrom<ReturnType<Transform>, PickKeys>>
  })
}

export async function getAsyncDataOrNull<
  DataT,
  _DataE = Error,
  Transform extends _Transform<DataT> = _Transform<DataT, DataT>,
  PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>,
>(
  key: string,
  handler: (ctx?: NuxtApp) => Promise<DataT>,
  options?: AsyncDataOptions<DataT, Transform>,
): Promise<Ref<PickFrom<ReturnType<Transform>, PickKeys> | null>> {
  return useAsyncData(key, handler, options).then(({ data, error }) => {
    if (error != null && error.value)
      return ref(null)
    else
      return data as Ref<PickFrom<ReturnType<Transform>, PickKeys>>
  })
}
