import type { ApiMenuCategory } from '~/types/api/menu'
import type { ApiPoi, ApiPoiCollection } from '~/types/api/poi'
import type { Poi } from '~/types/local/poi'

export function usePoi() {
  function formatPoi(
    feature: ApiPoi,
    category: ApiMenuCategory,
  ): Poi {
    const { colorFill, colorText } = useContrastedColors(
      category.category.color_fill,
      feature.properties.display?.color_text,
    )

    return {
      ...feature,
      properties: {
        ...feature.properties,
        display: {
          color_fill: colorFill,
          color_line: category.category.color_line,
          color_text: colorText,
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
