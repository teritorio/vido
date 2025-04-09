import type { ApiPoi } from '~/lib/apiPois'

type LabelType = 'details' | 'popup'
interface Options {
  type?: LabelType
}

/**
 * Returns '#000000' or '#FFFFFF' depending on which has better contrast with the given fill color.
 * @param fillColor - Hex color string (e.g., '#1a1a1a', '#fff', '#FFAA33')
 * @returns A high-contrast text color: '#000000' or '#FFFFFF'
 */
function getReadableTextColor(fillColor: string): '#000000' | '#FFFFFF' {
  const hex = fillColor.replace('#', '')

  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  // Perceived brightness (YIQ formula)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // If luminance is high, use black text; otherwise, white
  return yiq > 128 ? '#000000' : '#FFFFFF'
}

export function getContrastedColors(colorFill?: string, colorText?: string) {
  const fill = colorFill || '#000000'
  const text = colorText || getReadableTextColor(fill)

  return { colorFill: fill, colorText: text }
}

export default function useFeature(feature: Ref<ApiPoi>, options: Options = {
  type: undefined,
}) {
  //
  // Composables
  //
  const { locale, fallbackLocale } = useI18n()
  //
  // Data
  //
  const fallback = fallbackLocale.value.toString()
  const { type } = options

  //
  // Computed
  //
  const categoryName = computed(() => {
    switch (type) {
      case 'details':
        return getDetailsClassLabel()
      case 'popup':
        return getPopupClassLabel()
      default:
        return getClassLabel(locale.value)
    }
  })

  const name = computed(() => {
    switch (type) {
      case 'details':
        return feature.value.properties.name ?? getDetailsClassLabel()
      case 'popup':
        return feature.value.properties.name ?? getPopupClassLabel()
      default:
        return feature.value.properties.name ?? getClassLabel(locale.value)
    }
  })

  const seoTitle = computed(() => categoryName.value ? `${categoryName.value} - ${name.value}` : name.value)

  //
  // Methods
  //
  function getClassLabel(lang: string) {
    return feature.value.properties.editorial?.class_label && feature.value.properties.editorial.class_label[lang]
      ? feature.value.properties.editorial.class_label[lang]
      : undefined
  }

  function getDetailsClassLabel() {
    if (!feature.value.properties.editorial)
      return undefined

    if (feature.value.properties.editorial.class_label_details && feature.value.properties.editorial.class_label_details[locale.value])
      return feature.value.properties.editorial.class_label_details[locale.value]

    if (getClassLabel(locale.value))
      return getClassLabel(locale.value)

    if (feature.value.properties.editorial.class_label_details && feature.value.properties.editorial.class_label_details[fallback])
      return feature.value.properties.editorial.class_label_details[fallback]

    return getClassLabel(fallback)
  }

  function getPopupClassLabel() {
    if (!feature.value.properties.editorial)
      return undefined

    if (feature.value.properties.editorial.class_label_popup && feature.value.properties.editorial.class_label_popup[locale.value])
      return feature.value.properties.editorial.class_label_popup[locale.value]

    if (getClassLabel(locale.value))
      return getClassLabel(locale.value)

    if (feature.value.properties.editorial.class_label_popup && feature.value.properties.editorial.class_label_popup[fallback])
      return feature.value.properties.editorial.class_label_popup[fallback]

    return getClassLabel(fallback)
  }

  return {
    featureName: name,
    featureCategoryName: categoryName,
    featureSeoTitle: seoTitle,
  }
}
