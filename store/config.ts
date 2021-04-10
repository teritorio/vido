import { Store } from 'vuex'

import { Categories, LatLng, Pitch, ZoomLevel } from '@/utils/types'

enum Mutation {
  SET = 'SET',
}

interface State {
  categories: Categories | null
  map: {
    attribution: { [lang: string]: string }
    center: LatLng
    zoom: {
      default: ZoomLevel
      max: ZoomLevel
      min: ZoomLevel
    }
    pitch: Pitch
  } | null
  site: {
    [lang: string]: {
      name: string
      description: string
      logo: string
    }
  } | null
}

export const state = (): State => ({
  categories: null,
  map: null,
  site: null,
})

export const mutations = {
  [Mutation.SET](state: State, config: State) {
    state.categories = config.categories
    state.map = config.map
    state.site = config.site
  },
}

export const actions = {
  async fetch(store: Store<State>) {
    try {
      const configPromise = await fetch('/api/config')
      const config = await configPromise.json()

      const categories = Object.entries(
        config.classes as Categories
      ).reduce<Categories>((result, [categoryId, category]) => {
        // Fill the missing colors
        if (!category?.metadata?.color) {
          const defaultColor = '#ddd'

          if (
            category.level > 1 &&
            category?.parents &&
            Object.keys(category.parents).length > 0
          ) {
            const parentId = Object.keys(category.parents)[0]
            const parent = config.classes[parentId]

            category.metadata.color = parent?.metadata?.color || defaultColor
          } else {
            category.metadata.color = defaultColor
          }
        }

        result[categoryId] = category

        return result
      }, {})

      store.commit(Mutation.SET, {
        categories,
        map: config.map,
        site: config.site,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Vido error: Unable to fetch the config from the API')
    }
  },
}

export const getters = {
  site: (state: State) => state.site,
  map: (state: State) => state.map,
  categories: (state: State) => state.categories,

  subCategories: (state: State) => {
    if (!state.categories) {
      return []
    }

    return Object.values(state.categories)
      .filter((c) => c.level === 3)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  },

  superCategories: (state: State) => {
    if (!state.categories) {
      return []
    }

    return Object.values(state.categories)
      .filter((c) => c.level === 1)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  },

  getSubCategoriesFromCategoryId: (state: State) => (categoryId: string) => {
    if (!state.categories) {
      return []
    }

    return Object.values(state.categories)
      .filter((c) => c.parents?.[categoryId])
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  },

  highlightedSuperCategories: (state: State) => {
    if (!state.categories) {
      return []
    }

    return Object.values(state.categories)
      .filter((c) => c.level === 1 && c.highlighted)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  },

  nonHighlightedSuperCategories: (state: State) => {
    if (!state.categories) {
      return []
    }

    return Object.values(state.categories)
      .filter((c) => c.level === 1 && !c.highlighted)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  },
}
