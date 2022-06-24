import { Plugin } from '@nuxt/types'

import { PropertyTranslations } from '~/lib/apiPropertyTranslations'

export enum PropertyTranslationsContextEnum {
  Default = 'label',
  Popup = 'label_popup',
  Details = 'label_details',
  List = 'label_list',
}

export interface PropertyTranslationsPlugin {
  // @ts-ignore
  set(propertyTranslations: PropertyTranslations): void
  // @ts-ignore
  p(propertyName: string, context: PropertyTranslationsContextEnum): string
  // @ts-ignore
  pv(
    propertyName: string,
    valueName: string,
    context: PropertyTranslationsContextEnum
  ): string

  propertyTranslations: PropertyTranslations
}

const plugin: Plugin = (_, inject) => {
  const pt: PropertyTranslationsPlugin = {
    propertyTranslations: {},
    set(setPropertyTranslations: PropertyTranslations): void {
      pt.propertyTranslations = setPropertyTranslations
    },
    p(
      propertyName: string,
      context: PropertyTranslationsContextEnum = PropertyTranslationsContextEnum.Default
    ): string {
      const pn = pt.propertyTranslations[propertyName]
      return (
        (pn &&
          ((context && pn[context].fr) ||
            pn[PropertyTranslationsContextEnum.Default].fr)) ||
        propertyName
      )
    },
    pv(
      propertyName: string,
      valueName: string,
      context: PropertyTranslationsContextEnum = PropertyTranslationsContextEnum.Default
    ): string {
      const pn = pt.propertyTranslations[propertyName]
      return (
        (pn?.values &&
          ((context &&
            pn.values[valueName] &&
            pn.values[valueName][context]?.fr) ||
            (pn.values[valueName] &&
              pn.values[valueName][PropertyTranslationsContextEnum.Default]
                ?.fr))) ||
        valueName
      )
    },
  }
  inject('propertyTranslations', pt)
}

export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    readonly $propertyTranslations: PropertyTranslationsPlugin
  }
}
