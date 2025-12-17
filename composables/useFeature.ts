import type { ApiPoi } from '~/lib/apiPois'

type LabelType = 'details' | 'popup'
interface Options {
  type?: LabelType
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
        return feature.value.properties.name?.['fr-FR'] ?? getDetailsClassLabel()
      case 'popup':
        return feature.value.properties.name?.['fr-FR'] ?? getPopupClassLabel()
      default:
        return feature.value.properties.name?.['fr-FR'] ?? getClassLabel(locale.value)
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
