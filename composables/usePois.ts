import type { ApiPois } from '~/lib/apiPois'
import type { ApiPoi } from '~/types/api/poi'
import { PropertyTranslationsContextEnum } from '~/stores/site'

export function usePois() {
  const { routeToString, addressToString } = useField()
  const route = useRoute()
  const apiEndpoint = useState<string>('api-endpoint')

  const pois = ref<ApiPois | null>(null)
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

    const { data, error: err, pending: pend, status: stat } = await useFetch<ApiPois>(
      () => `${apiEndpoint.value}/pois/category/${id}.geojson`,
      {
        query,
        transform: pois => transformPois(pois, routeToString, addressToString),
      },
    )

    pois.value = data.value
    error.value = err.value
    pending.value = pend.value
    status.value = stat.value
  }

  watch([id, clipSlug], ([newId]) => {
    if (newId)
      fetchPois(newId)
    else pois.value = null
  }, { immediate: true })

  return { pois, error, pending, status }
}

function transformPois(
  pois: ApiPois,
  routeToString: Function,
  addressToString: Function,
): ApiPois {
  const features = pois.features
  const fields = features?.[0]?.properties.editorial?.list_fields || []

  return {
    ...pois,
    features: features.map((f: ApiPoi) => {
      const props = { ...f.properties }

      if (fields.some(f => f.field === 'route')) {
        props.route = routeToString(f.properties, getContext('route'))
      }

      if (fields.some(f => f.field === 'addr')) {
        props.addr = addressToString(f.properties)
      }

      return { ...f, properties: props }
    }),
  }
}

function getContext(key: string) {
  return key === 'opening_hours'
    ? PropertyTranslationsContextEnum.Card
    : PropertyTranslationsContextEnum.List
}
