import copy from 'fast-copy'
import { Store } from 'vuex'
// import { interpret, Interpreter, State } from 'xstate'

import { VidoFeature, ApiPois } from '@/lib/apiPois'
import { Category, FilterValues } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SET_FEATURES = 'SET_FEATURES',
  SET_FILTERS = 'SET_FILTERS',
  SET_FEATURES_LOADING = 'SET_FEATURES_LOADING',
  SET_ALL_FEATURES = 'SET_ALL_FEATURES',
}

interface FetchConfigPayload {
  apiEndpoint: string
  apiProject: string
  apiTheme: string
}

interface FetchFeaturesPayload {
  apiEndpoint: string
  apiProject: string
  apiTheme: string
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
  filters: { [subcat: number]: FilterValues }
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

function filterExist(
  filterToTest: string[],
  featureToTest: string[] | string
): boolean {
  if (Array.isArray(featureToTest)) {
    return featureToTest.some((feature) => filterToTest.includes(feature))
  } else {
    return filterToTest.includes(featureToTest)
  }
}

function keepFeature(feature: VidoFeature, filters: FilterValues): boolean {
  if (!filters || Object.keys(filters).length === 0) {
    return true
  }

  for (const key in filters) {
    if (
      filters[key].length > 0 &&
      (!feature.properties[key] ||
        !filterExist(filters[key], feature.properties[key]))
    ) {
      return false
    }
  }

  return true
}

export const actions = {
  async fetchConfig(
    store: Store<State>,
    { apiEndpoint, apiProject, apiTheme }: FetchConfigPayload
  ) {
    try {
      await fetch(`${apiEndpoint}/${apiProject}/${apiTheme}/menu`)
        .then((data) => data.json())
        .then((config: [Category]) => {
          const categories: State['categories'] = {}

          config
            .filter((category) => !category.hidden)
            .map((category) => {
              categories[category.id] = category
              return category
            })
            .forEach((category) => {
              // Separated from previous map to allow batch processing and make sure parent category is always there
              // Associate to parent_id
              if (category.parent_id && category.parent_id !== null) {
                const parent = categories[category.parent_id]
                if (parent) {
                  if (!parent.vido_children) {
                    parent.vido_children = []
                  }
                  parent.vido_children.push(category.id)
                }
              }
            })

          store.commit(Mutation.SET_CONFIG, { categories })
        })
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
    { apiEndpoint, apiProject, apiTheme, categoryIds }: FetchFeaturesPayload
  ) {
    store.commit(Mutation.SET_FEATURES_LOADING, { isLoadingFeatures: true })

    try {
      const previousFeatures = store.getters.allFeatures
      const existingFeatures = categoryIds.map((categoryId) =>
        Boolean(previousFeatures[categoryId])
      )

      const posts: ApiPois[] = await Promise.all(
        categoryIds
          .filter((categoryId) => !previousFeatures[categoryId])
          .map((categoryId) =>
            fetch(
              `${apiEndpoint}/${apiProject}/${apiTheme}/pois?idmenu=${categoryId}`
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

          features[categoryId] = post.features.map((f) => {
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

  setFilters(store: Store<State>, filters: { [subcat: number]: FilterValues }) {
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
      .filter((c) => c.parent_id === categoryId)
      .sort((a, b) => a.index_order - b.index_order),

  getHighlightedRootCategoriesFromCategoryId: (state: State) => (
    categoryId: number
  ) =>
    Object.values(state.categories)
      .filter(
        (c) =>
          c.parent_id !== null &&
          state.categories[c.parent_id]?.parent_id === null &&
          c.highlighted &&
          c.parent_id === categoryId
      )
      .sort((a, b) => a.index_order - b.index_order),

  getNonHighlightedRootCategoriesFromCategoryId: (state: State) => (
    categoryId: number
  ) =>
    Object.values(state.categories)
      .filter(
        (c) =>
          c.parent_id !== null &&
          state.categories[c.parent_id]?.parent_id === null &&
          !c.highlighted &&
          c.parent_id === categoryId
      )
      .sort((a, b) => a.index_order - b.index_order),

  categoryRootCategories: (state: State) =>
    Object.values(state.categories)
      .filter((c) => c.parent_id === null && c.vido_children)
      .sort((a, b) => a.index_order - b.index_order),

  rootCategories: (state: State) =>
    Object.values(state.categories)
      .filter(
        (c) =>
          c.parent_id !== null &&
          state.categories[c.parent_id]?.parent_id === null
      )
      .sort((a, b) => a.index_order - b.index_order),

  subCategories: (state: State) =>
    Object.values(state.categories)
      .filter(
        (c) =>
          c.parent_id !== null &&
          state.categories[c.parent_id]?.parent_id !== null
      )
      .sort((a, b) => a.index_order - b.index_order),
}
