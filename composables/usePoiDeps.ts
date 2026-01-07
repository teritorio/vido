import { ApiRouteWaypointTypeObject } from '~/types/api/poi-deps'
import type { ApiPoiDeps, ApiPoiDepsCollection, ApiPoiUnion } from '~/types/api/poi-deps'
import { type PoiUnion, iconMap } from '~/types/local/poi-deps'
import type { ApiMenuCategory } from '~/types/api/menu'

export function usePoiDeps() {
  const waypointIndex = ref(1)

  function isWaypoint(feature: ApiPoiUnion | PoiUnion, locale: LanguageCode): boolean {
    const route = feature.properties.route?.[locale]
    return !!(route && 'waypoint' in route)
  }

  function formatPoiDeps(
    feature: ApiPoiUnion,
    category: ApiMenuCategory,
    locale: LanguageCode,
  ): PoiUnion {
    let displayProps = {}
    let editorialProps = {}

    const { colorFill, colorText } = useContrastedColors(
      category.category.color_fill,
      feature.properties.display?.color_text,
    )

    if (isWaypoint(feature, locale)) {
      const f = feature as ApiPoiDeps
      const type = f.properties.route[locale]?.waypoint?.type

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

    editorialProps = {
      ...category.category.editorial,
      ...editorialProps,
    }

    return {
      ...feature,
      properties: {
        ...feature.properties,
        display: {
          color_fill: colorFill,
          color_line: category.category.color_line,
          color_text: colorText,
          ...displayProps,
          ...feature.properties.display,
        },
        editorial: {
          ...editorialProps,
          ...feature.properties.editorial,
        },
        vido_visible: true,
      },
    } as PoiUnion
  }

  function resetWaypointIndex() {
    waypointIndex.value = 1
  }

  function formatPoiDepsCollection(
    collection: ApiPoiDepsCollection,
    category: ApiMenuCategory,
    locale: LanguageCode,
  ): PoiUnion[] {
    resetWaypointIndex()

    return collection.features.map((feature) => {
      return formatPoiDeps(feature, category, locale)
    })
  }

  return {
    formatPoiDeps,
    formatPoiDepsCollection,
    isWaypoint,
    resetWaypointIndex,
  }
}
