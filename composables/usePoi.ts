import type { ApiMenuCategory } from '~/types/api/menu'
import type { ApiPoi } from '~/types/api/poi'
import type { Poi } from '~/types/local/poi'

export function usePoi() {
  function formatPoi(
    feature: ApiPoi,
    category: ApiMenuCategory,
  ): Poi {
    const { colorFill, colorText } = useContrastedColors(
      feature.properties.display?.color_fill || category.category.color_fill,
      feature.properties.display?.color_text,
    )

    return {
      ...feature,
      properties: {
        ...feature.properties,
        display: {
          color_fill: colorFill,
          color_line: feature.properties.display?.color_line || category.category.color_line || colorFill,
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

  return {
    formatPoi,
  }
}
