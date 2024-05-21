import { defineStore } from 'pinia'
import { vidoConfig } from '~/plugins/vido-config'
import { type ContentEntry, getContents } from '~/lib/apiContent'
import { type PropertyTranslations, getPropertyTranslations } from '~/lib/apiPropertyTranslations'
import { type Settings, getSettings } from '~/lib/apiSettings'
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
  actions: {
    async init() {
      const headers = useRequestHeaders()
      this.config = vidoConfig(headers)
      this.settings = await getSettings(this.config)
      this.contents = await getContents(this.config)
      this.translations = await getPropertyTranslations(this.config)
    },
  },
})
