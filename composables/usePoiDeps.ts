import { ApiRouteWaypointTypeObject } from '~/types/api/poi-deps'
import type { ApiPoiDeps, ApiPoiDepsCollection, ApiPoiUnion } from '~/types/api/poi-deps'
import { type PoiUnion, iconMap } from '~/types/local/poi-deps'
import type { ApiMenuCategory } from '~/types/api/menu'
import { menuStore as useMenuStore } from '~/stores/menu'
import type { ApiPoi } from '~/types/api/poi'

export function usePoiDeps() {
  const waypointIndex = ref(1)
  const menuStore = useMenuStore()

  function isWaypoint(feature: ApiPoiUnion | PoiUnion): boolean {
    return feature.properties['route:point:type']
  }

  function formatPoiDeps(
    feature: ApiPoiUnion,
    category: ApiMenuCategory,
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
      displayProps = {
        icon: category.category.icon,
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

    return collection.features.map((feature) => {
      const catId = isWaypoint(feature) ? mainPoi.properties.metadata.category_ids?.[0] : feature.properties.metadata.category_ids?.[0]

      if (!catId)
        throw createError(`Category ID not found for feature ${feature.properties.metadata.id}.`)

      const category = menuStore.getCurrentCategory(catId)

      if (!category)
        throw createError(`Category ${catId} not found.`)

      return formatPoiDeps(feature, category)
    })
  }

  return {
    formatPoiDeps,
    formatPoiDepsCollection,
    isWaypoint,
    resetWaypointIndex,
  }
}
