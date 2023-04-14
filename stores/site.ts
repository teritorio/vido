import { defineStore } from 'pinia'

import { ContentEntry } from '~/lib/apiContent'
import { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import { Settings } from '~/lib/apiSettings'
import { VidoConfig } from '~/utils/types-config'

interface State {
  locale: string | null
}

export const siteStore = defineStore('site', {
  state: (): State => ({
    locale: null,
  }),
})
