import { defineStore } from 'pinia'
import type { FitBoundsOptions } from 'maplibre-gl'
import type { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import type { LatLng, Pitch } from '~/utils/types'
import { Mode } from '~/utils/types'

export const mapStore = defineStore('map', () => {
  const boundOptions = ref<FitBoundsOptions>()
  const center = ref<LatLng>({ lng: 0, lat: 0 })
  const mode = ref<Mode>(Mode.BROWSER)
  const pitch = ref<Pitch>(0)
  const selectedFeature = ref<ApiPoi | null>(null)
  const teritorioCluster = ref<TeritorioCluster | null>(null)

  const isModeExplorer = computed(() => mode.value === Mode.EXPLORER)
  const isModeFavorites = computed(() => mode.value === Mode.FAVORITES)
  const isModeExplorerOrFavorites = computed(() => mode.value === Mode.EXPLORER || mode.value === Mode.FAVORITES)

  function setSelectedFeature(feature?: ApiPoi) {
    if (!feature) {
      selectedFeature.value = null
      teritorioCluster.value?.resetSelectedFeature()
    }
    else {
      const goodFeature = feature

      function isJsonObject(item: string): boolean {
        let value = false
        try {
          value = JSON.parse(item)
        }
        catch (e) {
          return false
        }

        return typeof value === 'object' && value !== null
      }

      if (feature.properties) {
        const cleanProperties: ApiPoiProperties = {} as ApiPoiProperties

        Object.keys(feature.properties).forEach((key) => {
          if (isJsonObject(feature.properties[key]))
            cleanProperties[key] = JSON.parse(feature.properties[key])
          else cleanProperties[key] = feature.properties[key]
        })

        goodFeature.properties = cleanProperties
      }

      selectedFeature.value = goodFeature
    }
  }

  return {
    boundOptions,
    center,
    mode,
    pitch,
    selectedFeature,
    teritorioCluster,
    isModeExplorer,
    isModeFavorites,
    isModeExplorerOrFavorites,
    setSelectedFeature,
  }
})
