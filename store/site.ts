import { Store } from 'vuex'

import { ContentEntry } from '~/lib/apiContent'
import { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import { Settings } from '~/lib/apiSettings'
import { VidoConfig } from '~/utils/types-config'

enum Mutation {
  SET_LOCALE = 'SET_LOCALE',
  SET_VIDO_CONFIG = 'SET_VIDO_CONFIG',
  SET_SETTINGS = 'SET_SETTINGS',
  SET_CONTENTS = 'SET_CONTENTS',
  SET_TRANSLATION = 'SET_TRANSLATION',
}

export interface State {
  locale: string | null
  config: VidoConfig | undefined
  settings: Settings | undefined
  contents: ContentEntry[] | undefined
  translations: PropertyTranslations | undefined
}

export const state = (): State | null => ({
  locale: null,
  config: undefined,
  settings: undefined,
  contents: undefined,
  translations: undefined,
})

export const mutations = {
  [Mutation.SET_LOCALE](state: State, locale: string) {
    state.locale = locale
  },
  [Mutation.SET_VIDO_CONFIG](state: State, config: VidoConfig) {
    state.config = config
  },
  [Mutation.SET_SETTINGS](state: State, settings: Settings) {
    state.settings = settings
  },
  [Mutation.SET_CONTENTS](state: State, contents: ContentEntry[]) {
    state.contents = contents
  },
  [Mutation.SET_TRANSLATION](state: State, translations: PropertyTranslations) {
    state.translations = translations
  },
}

export const actions = {
  setLocale(store: Store<State>, locale: string) {
    store.commit(Mutation.SET_LOCALE, locale)
  },

  setConfig(store: Store<State>, config: VidoConfig) {
    store.commit(Mutation.SET_VIDO_CONFIG, config)
  },

  setSettings(store: Store<State>, settings: Settings) {
    store.commit(Mutation.SET_SETTINGS, settings)
  },

  setContents(store: Store<State>, contents: ContentEntry[]) {
    store.commit(Mutation.SET_CONTENTS, contents)
  },

  setTranslations(store: Store<State>, translations: PropertyTranslations) {
    store.commit(Mutation.SET_TRANSLATION, translations)
  },
}

export const getters = {
  all: (state: State) => state,
  locale: (state: State) => state.locale,
  config: (state: State) => state.config,
  settings: (state: State) => state.settings,
  contents: (state: State) => state.contents,
  translations: (state: State) => state.translations,
}
