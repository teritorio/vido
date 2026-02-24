import type { PoiUnion } from '~/types/local/poi-deps'

type LabelType = 'details' | 'popup'
interface Options {
  type?: LabelType
}

export default function useFeature(feature: Ref<PoiUnion>, options: Options = {
  type: undefined,
}) {
  const { fallbackLocale } = useI18n()
  const lang = 'fr'

  const fallback = fallbackLocale.value.toString() as LanguageCode
  const { type } = options

  const categoryName = computed(() => {
    switch (type) {
      case 'details':
        return getDetailsClassLabel()
      case 'popup':
        return getPopupClassLabel()
      default:
        return getClassLabel(lang)
    }
  })

  const name = computed((): string | undefined => {
    switch (type) {
      case 'details':
        return feature.value.properties.name?.['fr-FR'] ?? getDetailsClassLabel()
      case 'popup':
        return feature.value.properties.name?.['fr-FR'] ?? getPopupClassLabel()
      default:
        return feature.value.properties.name?.['fr-FR'] ?? getClassLabel(lang)
    }
  })

  const seoTitle = computed(() => categoryName.value ? `${categoryName.value} - ${name.value}` : name.value)

  function getClassLabel(lang: LanguageCode) {
    return feature.value.properties.editorial.class_label?.[lang]
      ? feature.value.properties.editorial.class_label[lang]
      : undefined
  }

  function getDetailsClassLabel() {
    if (feature.value.properties.editorial.class_label_details?.[lang])
      return feature.value.properties.editorial.class_label_details[lang]

    if (getClassLabel(lang))
      return getClassLabel(lang)

    if (feature.value.properties.editorial.class_label_details?.[fallback])
      return feature.value.properties.editorial.class_label_details[fallback]

    return getClassLabel(fallback)
  }

  function getPopupClassLabel() {
    if (feature.value.properties.editorial.class_label_popup?.[lang])
      return feature.value.properties.editorial.class_label_popup[lang]

    if (getClassLabel(lang))
      return getClassLabel(lang)

    if (feature.value.properties.editorial.class_label_popup?.[fallback])
      return feature.value.properties.editorial.class_label_popup[fallback]

    return getClassLabel(fallback)
  }

  return {
    featureName: name,
    featureCategoryName: categoryName,
    featureSeoTitle: seoTitle,
  }
}
