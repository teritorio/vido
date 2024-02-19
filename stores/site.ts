import { defineStore } from 'pinia'

import type { ContentEntry } from '~/lib/apiContent'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'
import type { VidoConfig } from '~/utils/types-config'

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
