import { Store } from 'vuex'

import { Classes, LatLng, Pitch, ZoomLevel } from '@/utils/types'

enum Mutation {
  SET = 'SET',
}

interface State {
  site: {
    [lang: string]: {
      name: string
      description: string
      logo: string
    }
  } | null
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
  classes: Classes | null
}

export const state = (): State => ({
  site: null,
  map: null,
  classes: null,
})

export const mutations = {
  [Mutation.SET](state: State, config: State) {
    state.site = config.site
    state.map = config.map
    state.classes = config.classes
  },
}

export const actions = {
  async fetch(store: Store<State>) {
    try {
      const configPromise = await fetch('/api/config')
      const config = await configPromise.json()

      config.classes = Object.entries(
        config.classes as Classes
      ).reduce<Classes>((result, [categoryId, category]) => {
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

      store.commit(Mutation.SET, config)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Vido error: Unable to fetch the config from the API')
    }
  },
}

export const getters = {
  site: (state: State) => state.site,
  map: (state: State) => state.map,
  classes: (state: State) => state.classes,

  firstLevelCategories: (state: State) => {
    if (!state.classes) {
      return []
    }

    return Object.values(state.classes)
      .filter((c) => c.level === 1)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  },

  getSubLevelCategoriesFromCategoryId: (state: State) => (
    categoryId: string
  ) => {
    if (!state.classes) {
      return []
    }

    return Object.values(state.classes)
      .filter((c) => c.parents?.[categoryId])
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  },

  highlightedFirstLevelCategories: (state: State) => {
    if (!state.classes) {
      return []
    }

    return Object.values(state.classes)
      .filter((c) => c.level === 1 && c.highlighted)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  },

  nonHighlightedFirstLevelCategories: (state: State) => {
    if (!state.classes) {
      return []
    }

    return Object.values(state.classes)
      .filter((c) => c.level === 1 && !c.highlighted)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  },
}
