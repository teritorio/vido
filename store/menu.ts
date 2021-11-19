import copy from 'fast-copy'
import { Store } from 'vuex'
// import { interpret, Interpreter, State } from 'xstate'

import { ApiPosts, Category, VidoFeature, FiltreValues } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SET_FEATURES = 'SET_FEATURES',
  SET_FILTERS = 'SET_FILTERS',
  SET_FEATURES_LOADING = 'SET_FEATURES_LOADING',
  SET_ALL_FEATURES = 'SET_ALL_FEATURES',
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
    [categoryId: number]: Category
  }
  isLoaded: boolean
  features: {
    [categoryId: number]: VidoFeature[]
  }
  allFeatures: {
    [categoryId: number]: VidoFeature[]
  }
  filters: { [subcat: number]: FiltreValues }
  isLoadingFeatures: boolean
}

export const state = (): State => ({
  categories: {},
  isLoaded: false,
  features: {},
  filters: {},
  allFeatures: {},
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

  [Mutation.SET_ALL_FEATURES](state: State, payload: State) {
    state.allFeatures = { ...state.allFeatures, ...payload.features }
  },

  [Mutation.SET_FEATURES_LOADING](state: State, payload: State) {
    state.isLoadingFeatures = payload.isLoadingFeatures
  },
}

function keepFeature(feature: VidoFeature, filters: FiltreValues): boolean {
  if (!filters || Object.keys(filters).length === 0) {
    return true
  }

  const filterExist = (
    filterToTest: string[],
    featureToTest: string[] | string
  ) => {
    if (Array.isArray(featureToTest)) {
      return featureToTest.find((feature) => filterToTest.includes(feature))
    } else {
      return filterToTest.includes(featureToTest)
    }
  }

  for (const key in filters.selectionFiltre) {
    if (
      filters.selectionFiltre[key].length > 0 &&
      (!feature.properties[key] ||
        !filterExist(filters.selectionFiltre[key], feature.properties[key]))
    ) {
      return false
    }
  }

  for (const key in filters.checkboxFiltre) {
    if (
      filters.checkboxFiltre[key].length > 0 &&
      (!feature.properties[key] ||
        !filterExist(filters.checkboxFiltre[key], feature.properties[key]))
    ) {
      return false
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
      const configPromise = await fetch(`${apiEndpoint}/geodata/v0.1/menu`)

      const config: {
        [id: number]: Category
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
          if (category.parent && category.parent !== 0) {
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
      const previousFeatures = store.getters.allFeatures
      const existingFeatures = categoryIds.map((categoryId) =>
        Boolean(previousFeatures[categoryId])
      )

      const posts: ApiPosts[] = await Promise.all(
        categoryIds
          .filter((categoryId) => !previousFeatures[categoryId])
          .map((categoryId) =>
            fetch(
              `${apiEndpoint}/geodata/v0.1/pois?idmenu=${categoryId}`
            ).then((res) => res.json())
          )
      )

      const features: State['features'] = {}

      let i = 0

      for (let j = 0; j < categoryIds.length; j++) {
        const categoryId = categoryIds[j]

        if (existingFeatures[j]) {
          features[categoryId] = previousFeatures[categoryId].map(
            (f: VidoFeature) => ({
              ...f,
              properties: {
                ...f.properties,
                vido_visible: keepFeature(f, store.getters.filters[categoryId]),
              },
            })
          )
        } else {
          const post = posts[i]

          features[categoryId] = [
            ...((post.osm?.[0].FeaturesCollection.features ||
              []) as VidoFeature[]),
            ...((post.tis?.[0].FeaturesCollection.features ||
              []) as VidoFeature[]),
          ].map((f) => {
            f.properties.vido_cat = categoryId
            f.properties.vido_visible = keepFeature(
              f,
              store.getters.filters[categoryId]
            )
            return f
          })

          i++
        }
      }

      store.commit(Mutation.SET_FEATURES, { features })
      store.commit(Mutation.SET_ALL_FEATURES, { features })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Vido error: Unable to fetch the features from the API',
        error
      )
      store.commit(Mutation.SET_FEATURES_LOADING, { isLoadingFeatures: false })
    }
  },

  setFilters(store: Store<State>, filters: { [subcat: number]: FiltreValues }) {
    store.commit(Mutation.SET_FILTERS, { filters })

    // Update features visibility
    const features: { [categoryId: number]: VidoFeature[] } = copy(
      store.getters.features
    )
    Object.keys(features).forEach((categoryIdString: string) => {
      const categoryId = parseInt(categoryIdString, 10)
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
  allFeatures: (state: State) => state.allFeatures,
  isLoaded: (state: State) => state.isLoaded,
  isLoadingFeatures: (state: State) => state.isLoadingFeatures,
  filters: (state: State) => state.filters,
  features: (state: State) => state.features,

  getSubCategoriesFromCategoryId: (state: State) => (categoryId: number) =>
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
