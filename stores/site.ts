import { defineStore } from 'pinia'

import { ContentEntry } from '~/lib/apiContent'
import { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import { Settings } from '~/lib/apiSettings'
import { VidoConfig } from '~/utils/types-config'

interface State {
  locale: string | null
  config: VidoConfig | undefined
  settings: Settings | undefined
  contents: ContentEntry[] | undefined
  translations: PropertyTranslations | undefined
}

export const siteStore = defineStore('site', {
  state: (): State => ({
    locale: null,
    config: undefined,
    settings: undefined,
    contents: undefined,
    translations: undefined,
  }),
})
