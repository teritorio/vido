import { captureMessage } from '@sentry/nuxt'
import { ApiRouteWaypointTypeObject } from '~/types/api/poi-deps'
import type { ApiPoiDeps, ApiPoiDepsCollection, ApiPoiUnion } from '~/types/api/poi-deps'
import { type PoiUnion, iconMap } from '~/types/local/poi-deps'
import { menuStore as useMenuStore } from '~/stores/menu'
import { mapStore as useMapStore } from '~/stores/map'
import type { ApiPoi } from '~/types/api/poi'
import type { Poi } from '~/types/local/poi'
import type { MenuCategory } from '~/types/local/menu'

export function usePoiDeps() {
  const waypointIndex = ref(1)
  const menuStore = useMenuStore()

  function isWaypoint(feature: ApiPoiUnion | PoiUnion): boolean {
    return feature.properties['route:point:type']
  }

  function formatPoiDeps(
    feature: ApiPoiUnion,
    category: MenuCategory,
  ): PoiUnion {
    let displayProps = {}
    let editorialProps = {}

    const { colorFill, colorText } = useContrastedColors(
      feature.properties.display?.color_fill || category.category.color_fill,
      feature.properties.display?.color_text,
    )

    if (isWaypoint(feature)) {
      const f = feature as ApiPoiDeps
      const type = f.properties['route:point:type']

      if (!type) {
        throw new Error(`Waypoint ${f.properties.id} is missing type.`)
      }

      displayProps = {
        icon: iconMap[type],
        text: type === ApiRouteWaypointTypeObject.waypoint ? waypointIndex.value.toString() : undefined,
      }

      editorialProps = {
        'website:details': undefined,
      }

      if (type === ApiRouteWaypointTypeObject.waypoint)
        waypointIndex.value++
    }
    else {
      const hasBbox = !!feature.bbox
      const iconShow = !(category.category.icon_show === 'never' && hasBbox)

      displayProps = {
        icon: category.category.icon,
        icon_show: iconShow,
        style_class: category.category.style_class,
      }
    }

    displayProps = {
      color_fill: colorFill,
      color_line: feature.properties.display?.color_line || category.category.color_line || colorFill,
      color_text: colorText,
      ...displayProps,
    }

    editorialProps = {
      ...category.category.editorial,
      ...feature.properties.editorial,
      ...editorialProps,
    }

    return {
      ...feature,
      properties: {
        ...feature.properties,
        display: displayProps,
        editorial: editorialProps,
        vido_visible: true,
      },
    } as PoiUnion
  }

  function resetWaypointIndex() {
    waypointIndex.value = 1
  }

  function getMainPoi(features: ApiPoiUnion[], poiId: number): ApiPoi {
    const poi = features.find(feature => feature.properties.metadata.id === poiId)

    if (!poi)
      throw createError(`Feature with ID: ${poiId} not found.`)

    return poi as ApiPoi
  }

  function formatPoiDepsCollection(
    collection: ApiPoiDepsCollection,
    mainPoiId: number,
  ): PoiUnion[] {
    resetWaypointIndex()

    const mainPoi = getMainPoi(collection.features, mainPoiId)

    const depIds = mainPoi.properties.metadata.dep_ids
    const sortedFeatures = depIds
      ? collection.features.slice().sort((a, b) => {
        const indexA = depIds.indexOf(a.properties.metadata.id)
        const indexB = depIds.indexOf(b.properties.metadata.id)
        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB)
      })
      : collection.features

    return sortedFeatures.flatMap((feature) => {
      let catId = feature.properties.metadata.category_ids?.[0]

      if (!catId) {
        catId = mainPoi.properties.metadata.category_ids?.[0]
        if (!isWaypoint(feature))
          captureMessage(`Feature ${feature.properties.metadata.id} has no category_ids, falling back to main POI category`, 'warning')
      }

      if (!catId)
        throw createError(`Category ID not found for feature ${feature.properties.metadata.id}.`)

      let category = menuStore.getCurrentCategory(catId)

      if (!category) {
        captureMessage(`Category ${catId} not found in menu for feature ${feature.properties.metadata.id}`, 'warning')
        category = menuStore.getCurrentCategory(mainPoi.properties.metadata.category_ids?.[0] as number)
      }

      if (!category) {
        // Fallback to currently selected categories
        // (e.g. POI accessible via category 9050 but deps returns category 45827)
        for (const selectedId of menuStore.selectedCategoryIds) {
          category = menuStore.getCurrentCategory(selectedId)
          if (category)
            break
        }
      }

      if (!category) {
        captureMessage(`Category ${catId} not found, skipping feature ${feature.properties.metadata.id}`, 'warning')
        return []
      }

      return formatPoiDeps(feature, category)
    })
  }

  function processPoiDeps(
    deps: PoiUnion[],
    poiId: number,
    selectedCategoryIds: number[],
  ): void {
    const mapStore = useMapStore()

    // Store deps IDs
    mapStore.setSelectedFeatureDepsIDs()
    deps.forEach((f) => {
      mapStore.addSelectedFeatureDepsIDs(f.properties.metadata.id)
    })

    // Find and set selected feature
    const poi = deps.find(f => f.properties.metadata.id === poiId)
    if (poi)
      mapStore.setSelectedFeature(poi as Poi)

    if (poi) {
      const currentCategory = selectedCategoryIds.find(
        id => poi.properties.metadata.category_ids?.includes(id),
      ) || poi.properties.metadata.category_ids?.[0]

      if (currentCategory) {
        menuStore.filterByDeps(currentCategory, deps)

        if (deps.length > 1)
          mapStore.setIsDepsView(true)
        else
          mapStore.setIsDepsView(false)
      }
    }
  }

  return {
    formatPoiDeps,
    formatPoiDepsCollection,
    isWaypoint,
    processPoiDeps,
    resetWaypointIndex,
  }
}
