import type { ApiMenuCategory } from '~/types/api/menu'
import type { ApiPoi, ApiPoiCollection } from '~/types/api/poi'
import type { Poi } from '~/types/local/poi'

export function usePoi() {
  function formatPoi(
    feature: ApiPoi,
    category: ApiMenuCategory,
  ): Poi {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        display: {
          icon: category.category.icon,
          style_class: category.category.style_class,
          ...feature.properties.display,
        },
        editorial: {
          ...category.category.editorial,
          ...feature.properties.editorial,
        },
        vido_visible: true,
      },
    } as Poi
  }

  function formatPoiCollection(
    collection: ApiPoiCollection,
    category: ApiMenuCategory,
  ): Poi[] {
    return collection.features.map((feature) => {
      return formatPoi(feature, category)
    })
  }

  return {
    formatPoi,
    formatPoiCollection,
  }
}
