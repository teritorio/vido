import type { App } from 'vue'
import { defineNuxtPlugin } from '#app/nuxt'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'

export enum PropertyTranslationsContextEnum {
  Default = 'label',
  Card = 'label_popup',
  Details = 'label_details',
  List = 'label_list',
}

const Default = PropertyTranslationsContextEnum.Default

export interface PropertyTranslationsPlugin {
  set: (propertyTranslations: PropertyTranslations) => void
  p: (propertyName: string, context: PropertyTranslationsContextEnum) => string
  pv: (
    propertyName: string,
    valueName: string,
    context: PropertyTranslationsContextEnum
  ) => string

  propertyTranslations: PropertyTranslations
}

const pt: PropertyTranslationsPlugin = {
  propertyTranslations: {},
  set(setPropertyTranslations: PropertyTranslations): void {
    pt.propertyTranslations = setPropertyTranslations
  },
  p(
    propertyName: string,
    context: PropertyTranslationsContextEnum = Default,
  ): string {
    const pn = pt.propertyTranslations[propertyName]
    return (
      // When context exists, does not use default
      (pn?.[context] ? pn?.[context]?.fr : pn?.[Default]?.fr) || propertyName
    )
  },
  pv(
    propertyName: string,
    valueName: string,
    context: PropertyTranslationsContextEnum = Default,
  ): string {
    const pn = pt.propertyTranslations[propertyName]?.values?.[valueName]
    return (
      // When context exists, does not use default
      (pn?.[context] ? pn?.[context]?.fr : pn?.[Default]?.fr) || valueName
    )
  },
}

export const propertyTranslationsVuePlugin = {
  install(app: App, _options?: object) {
    app.config.globalProperties.$propertyTranslations = pt
  },
}

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      propertyTranslations: pt,
    },
  }
})
