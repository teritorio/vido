import { defineStore } from 'pinia'
import type { FitBoundsOptions } from 'maplibre-gl'
import type { TeritorioCluster } from '@teritorio/maplibre-gl-teritorio-cluster'
import type { ApiPoi, ApiPoiProperties } from '~/types/api/poi'
import type { LatLng, Pitch } from '~/utils/types'
import { Mode } from '~/utils/types'

export const mapStore = defineStore('map', () => {
  const boundOptions = ref<FitBoundsOptions>()
  const center = ref<LatLng>({ lng: 0, lat: 0 })
  const mode = ref<Mode>(Mode.BROWSER)
  const pitch = ref<Pitch>(0)
  const selectedFeature = ref<ApiPoi>()
  const selectedFeatureDepsIDs = ref<number[]>([])
  const teritorioCluster = ref<TeritorioCluster>()
  const isDepsView = ref<boolean>(false)

  const isModeExplorer = computed(() => mode.value === Mode.EXPLORER)
  const isModeFavorites = computed(() => mode.value === Mode.FAVORITES)
  const isModeExplorerOrFavorites = computed(() => mode.value === Mode.EXPLORER || mode.value === Mode.FAVORITES)

  function setIsDepsView(state: boolean): void {
    isDepsView.value = state
  }

  function setSelectedFeatureDepsIDs(ids?: number[]): void {
    selectedFeatureDepsIDs.value = ids || []
  }

  function addSelectedFeatureDepsIDs(id: number): void {
    selectedFeatureDepsIDs.value.push(id)
  }

  function _isJsonObject(item: string): boolean {
    let value = false
    try {
      value = JSON.parse(item)
    }
    catch (e) {
      return false
    }

    return typeof value === 'object' && value !== null
  }

  function setSelectedFeature(feature?: ApiPoi) {
    if (!feature) {
      selectedFeature.value = undefined
      teritorioCluster.value?.resetSelectedFeature()
    }
    else {
      const goodFeature = feature

      if (feature.properties) {
        const cleanProperties: ApiPoiProperties = {} as ApiPoiProperties

        Object.keys(feature.properties).forEach((key) => {
          if (_isJsonObject(feature.properties[key]))
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
    selectedFeatureDepsIDs,
    teritorioCluster,
    isDepsView,
    isModeExplorer,
    isModeFavorites,
    isModeExplorerOrFavorites,
    setIsDepsView,
    setSelectedFeatureDepsIDs,
    addSelectedFeatureDepsIDs,
    setSelectedFeature,
  }
})
