import { Store } from 'vuex'

import { ApiCategoryBase, Category } from '@/utils/types'

enum Mutation {
  SET = 'SET',
}

interface State {
  categories: Category[]
  isLoaded: boolean
}

export const state = (): State => ({
  categories: [],
  isLoaded: false,
})

export const mutations = {
  [Mutation.SET](state: State, config: State) {
    state.categories = config.categories

    state.isLoaded = true
  },
}

export const actions = {
  async fetch(store: Store<State>, apiOrigin: string) {
    try {
      const configPromise = await fetch(`${apiOrigin}/geodata/v1/menu`)

      const config: {
        [id: string]: ApiCategoryBase
      } = await configPromise.json()

      const categories = Object.values(config).filter(
        (category) => category.isDataItem === true
      )

      store.commit(Mutation.SET, { categories })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Vido error: Unable to fetch the menu config from the API',
        error
      )
    }
  },
}

export const getters = {
  categories: (state: State) => state.categories,
  isLoaded: (state: State) => state.isLoaded,

  getSubCategoriesFromCategoryId: (state: State) => (categoryId: string) =>
    state.categories
      .filter((c) => c.parent === categoryId)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  highlightedRootCategories: (state: State) =>
    state.categories
      .filter((c) => c.level === 1 && c.highlighted)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  nonHighlightedRootCategories: (state: State) =>
    state.categories
      .filter((c) => c.level === 1 && !c.highlighted)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  rootCategories: (state: State) =>
    state.categories
      .filter((c) => c.level === 1)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  subCategories: (state: State) =>
    state.categories
      .filter((c) => c.level > 1)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
}
