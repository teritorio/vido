import type { ApiPoi, ApiPoiCollection } from '~/types/api/poi'
import { menuStore as useMenuStore } from '~/stores/menu'
import type { Poi } from '~/types/local/poi'

export function usePois() {
  const menuStore = useMenuStore()
  const route = useRoute()
  const apiEndpoint = useState<string>('api-endpoint')
  const poiCompo = usePoi()

  const pois = ref<Poi[]>()
  const error = ref()
  const pending = ref(false)
  const status = ref()

  const id = computed(() => route.params.id as string | undefined)
  const clipSlug = computed(() => route.query.clipingPolygonSlug)

  const fetchPois = async (id: string) => {
    if (!id)
      return

    const query: Record<string, any> = {
      geometry_as: 'point',
      short_description: true,
      cliping_polygon_slug: clipSlug.value,
    }

    const { data, error: err, pending: pend, status: stat } = await useFetch(
      () => `${apiEndpoint.value}/pois/category/${id}.geojson`,
      {
        query,
        transform: (pois: ApiPoiCollection) => transformApiPoiCollection(pois),
      },
    )

    if (err.value)
      createError(error.value)

    if (stat.value === 'success' && data.value) {
      pois.value = data.value
      error.value = err.value
      pending.value = pend.value
      status.value = stat.value
    }
  }

  watch([id, clipSlug], ([newId]) => {
    if (newId)
      fetchPois(newId)
    else pois.value = undefined
  }, { immediate: true })

  function transformApiPoiCollection(data: ApiPoiCollection): Poi[] {
    return data.features.map((feature: ApiPoi) => {
      const catId = feature.properties.metadata.category_ids?.[0]

      if (!catId)
        throw createError(`Category ID not found for feature ${feature.properties.metadata.id}.`)

      const category = menuStore.getCurrentCategory(catId)

      if (!category)
        throw createError(`Category ${catId} not found.`)

      return poiCompo.formatPoi(feature, category)
    })
  }

  return { pois, error, pending, status }
}
