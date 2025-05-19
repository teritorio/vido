import type { ApiPoi } from '~/lib/apiPois'

type LabelType = 'details' | 'popup'
interface Options {
  type?: LabelType
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace('#', '')
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  return [r, g, b]
}

function getRelativeLuminance([r, g, b]: [number, number, number]): number {
  const srgb = [r, g, b].map(v => v / 255)
  const linear = srgb.map(c =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hexToRgb(hex1))
  const lum2 = getRelativeLuminance(hexToRgb(hex2))
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function getContrastedColors(
  colorFill: string,
  colorText?: '#000000' | '#FFFFFF',
): { colorFill: string, colorText: '#000000' | '#FFFFFF' } {
  const AAA_CONTRAST_THRESHOLD = 4.5

  const contrastWithWhite = getContrastRatio(colorFill, '#FFFFFF')
  const contrastWithBlack = getContrastRatio(colorFill, '#000000')

  let finalTextColor: '#000000' | '#FFFFFF'

  if (!colorText) {
    if (contrastWithWhite >= AAA_CONTRAST_THRESHOLD) {
      finalTextColor = '#FFFFFF' // Prefer white
    }
    else if (contrastWithBlack >= AAA_CONTRAST_THRESHOLD) {
      finalTextColor = '#000000' // Fallback to black
    }
    else {
      // Neither passes AAA — pick best (even if below AAA)
      finalTextColor = contrastWithWhite >= contrastWithBlack ? '#FFFFFF' : '#000000'
    }
  }
  else {
    finalTextColor = colorText
  }

  return { colorFill, colorText: finalTextColor }
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
