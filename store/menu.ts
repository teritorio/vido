import copy from 'fast-copy'
import { Store } from 'vuex'

import { ApiPosts, Category, VidoFeature, FiltreValues } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SET_FEATURES = 'SET_FEATURES',
  SET_FILTERS = 'SET_FILTERS',
  SET_FEATURES_LOADING = 'SET_FEATURES_LOADING',
}

interface FetchConfigPayload {
  apiEndpoint: string
}

interface FetchFeaturesPayload {
  apiEndpoint: string
  categoryIds: Category['id'][]
}

export interface State {
  categories: {
    [categoryId: string]: Category
  }
  isLoaded: boolean
  features: {
    [categoryId: string]: VidoFeature[]
  }
  filters: { [subcat: string]: FiltreValues }
  isLoadingFeatures: boolean
}

export const state = (): State => ({
  categories: {},
  isLoaded: false,
  features: {},
  filters: {},
  isLoadingFeatures: false,
})

export const mutations = {
  [Mutation.SET_CONFIG](state: State, payload: State) {
    state.categories = payload.categories
    state.isLoaded = true
  },

  [Mutation.SET_FILTERS](state: State, payload: State) {
    state.filters = payload.filters
  },

  [Mutation.SET_FEATURES](state: State, payload: State) {
    state.features = payload.features
    state.isLoadingFeatures = false
  },

  [Mutation.SET_FEATURES_LOADING](state: State, payload: State) {
    state.isLoadingFeatures = payload.isLoadingFeatures
  },
}

function keepFeature(feature: VidoFeature, filters: FiltreValues): boolean {
  if (!filters || Object.keys(filters).length === 0) {
    return true
  }

  for (const key in filters.selectionFiltre) {
    if (
      filters.selectionFiltre[key].length > 0 &&
      (!feature.properties[key] ||
        !filters.selectionFiltre[key].includes(feature.properties[key]))
    ) {
      return false
    }
  }

  for (const key in filters.checkboxFiltre) {
    if (filters.checkboxFiltre[key].length > 0) {
      if (
        !feature.properties[key] ||
        !filters.checkboxFiltre[key].includes(feature.properties[key])
      ) {
        if (
          typeof feature.properties[key] === 'string' &&
          feature.properties[key].includes('#')
        ) {
          const values = feature.properties[key].split('#')
          if (
            !values.find((v: string) =>
              (filters.checkboxFiltre || {})[key].includes(v)
            )
          ) {
            return false
          }
        } else {
          return false
        }
      }
    }
  }

  for (const key in filters.booleanFiltre) {
    if (
      filters.booleanFiltre[key].length > 0 &&
      (!feature.properties[key] ||
        !filters.booleanFiltre[key].includes(feature.properties[key]))
    ) {
      return false
    }
  }

  return true
}

export const actions = {
  async fetchConfig(store: Store<State>, { apiEndpoint }: FetchConfigPayload) {
    try {
      const configPromise = await fetch(`${apiEndpoint}/geodata/v1/menu`)

      const config: {
        [id: string]: Category
      } = await configPromise.json()

      const categories: State['categories'] = {}

      Object.values(config)
        .filter((category) => category.isDataItem && !category.metadata.hide)
        .map((category) => {
          categories[category.id] = category
          return category
        })
        .forEach((category) => {
          // Separated from previous map to allow batch processing and make sure parent category is always there
          // Associate to parent
          if (category.parent && category.parent !== '0') {
            const parent = categories[category.parent]
            if (parent) {
              if (!parent.vido_children) {
                parent.vido_children = []
              }
              parent.vido_children.push(category.id)
            }
          }
        })

      store.commit(Mutation.SET_CONFIG, { categories })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Vido error: Unable to fetch the menu config from the API',
        error
      )
    }
  },

  async fetchFeatures(
    store: Store<State>,
    { apiEndpoint, categoryIds }: FetchFeaturesPayload
  ) {
    store.commit(Mutation.SET_FEATURES_LOADING, { isLoadingFeatures: true })

    try {
      const posts: ApiPosts[] = await Promise.all(
        categoryIds.map((categoryId) =>
          fetch(
            `${apiEndpoint}/geodata/v1/posts?idmenu=${categoryId}`
          ).then((res) => res.json())
        )
      )

      const features: State['features'] = {}

      posts.forEach((post, index) => {
        const categoryId = categoryIds[index]

        features[categoryId] = [
          ...((post.osm?.[0].FeaturesCollection.features ||
            []) as VidoFeature[]),
          ...((post.tis?.[0].FeaturesCollection.features ||
            []) as VidoFeature[]),
        ].map((f) => {
          f.properties.vido_cat = parseInt(categoryId, 10)
          f.properties.vido_visible = keepFeature(
            f,
            store.getters.filters[categoryId]
          )
          return f
        })
      })

      store.commit(Mutation.SET_FEATURES, { features })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Vido error: Unable to fetch the features from the API',
        error
      )
      store.commit(Mutation.SET_FEATURES_LOADING, { isLoadingFeatures: false })
    }
  },

  setFilters(store: Store<State>, filters: { [subcat: string]: FiltreValues }) {
    store.commit(Mutation.SET_FILTERS, { filters })

    // Update features visibility
    const features: { [categoryId: string]: VidoFeature[] } = copy(
      store.getters.features
    )
    Object.keys(features).forEach((categoryId: string) => {
      features[categoryId] = features[categoryId].map((f: VidoFeature) => {
        f.properties.vido_visible = keepFeature(f, filters[categoryId])
        return f
      })
    })
    store.commit(Mutation.SET_FEATURES, { features })
  },
}

export const getters = {
  categories: (state: State) => state.categories,
  isLoaded: (state: State) => state.isLoaded,
  isLoadingFeatures: (state: State) => state.isLoadingFeatures,
  filters: (state: State) => state.filters,
  features: (state: State) => state.features,

  getSubCategoriesFromCategoryId: (state: State) => (categoryId: string) =>
    Object.values(state.categories)
      .filter((c) => c.parent === categoryId)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  highlightedRootCategories: (state: State) =>
    Object.values(state.categories)
      .filter((c) => c.level === 1 && c.highlighted)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  nonHighlightedRootCategories: (state: State) =>
    Object.values(state.categories)
      .filter((c) => c.level === 1 && !c.highlighted)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  rootCategories: (state: State) =>
    Object.values(state.categories)
      .filter((c) => c.level === 1)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  subCategories: (state: State) =>
    Object.values(state.categories)
      .filter((c) => c.level > 1)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
}
