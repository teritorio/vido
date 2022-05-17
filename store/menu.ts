import copy from 'fast-copy'
import { deepEqual } from 'fast-equals'
import { Store } from 'vuex'

import { Category } from '@/lib/apiMenu'
import { ApiPoi, ApiPois, getPoiByCategoryId } from '@/lib/apiPois'
import {
  FilterValues,
  filterValueFactory,
  filterValuesIsSet,
} from '@/utils/types-filters'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SET_FEATURES = 'SET_FEATURES',
  SET_FILTERS = 'SET_FILTERS',
  SET_FEATURES_LOADING = 'SET_FEATURES_LOADING',
  SET_ALL_FEATURES = 'SET_ALL_FEATURES',
}

interface FetchConfigPayload {
  categories: Category[]
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
    [categoryId: number]: ApiPoi[]
  }
  allFeatures: {
    [categoryId: number]: ApiPoi[]
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

function keepFeature(filters: FilterValues, feature: ApiPoi): boolean {
  return filters.some((filter) => filter.isMatch(feature.properties))
}

export const actions = {
  fetchConfig(store: Store<State>, { categories }: FetchConfigPayload) {
    try {
      const stateCategories: State['categories'] = {}
      const filters: { [subcat: number]: FilterValues } = {}

      store.commit(Mutation.SET_CONFIG, { categories: null }) // Hack, release from store before edit and reappend
      categories
        .filter((category) => !category.hidden)
        .map((category) => {
          stateCategories[category.id] = category
          return category
        })
        .forEach((category) => {
          // Separated from previous map to allow batch processing and make sure parent category is always there
          // Associate to parent_id
          if (category.parent_id && category.parent_id !== null) {
            const parent = stateCategories[category.parent_id]
            if (parent?.menu_group) {
              if (!parent.menu_group.vido_children) {
                parent.menu_group.vido_children = []
              }
              parent.menu_group.vido_children.push(category.id)
            }
          }

          if (category.category?.filters) {
            filters[category.id] = category.category?.filters.map((filter) =>
              filterValueFactory(filter)
            )
          }
        })
      store.commit(Mutation.SET_CONFIG, { categories: stateCategories })
      store.commit(Mutation.SET_FILTERS, { filters })
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

      const posts: ApiPois[] = (
        await Promise.all(
          categoryIds
            .filter((categoryId) => !previousFeatures[categoryId])
            .map((categoryId) =>
              getPoiByCategoryId(apiEndpoint, apiProject, apiTheme, categoryId)
            )
        )
      ).filter((e) => e) as ApiPois[]

      const features: State['features'] = {}

      let i = 0

      for (let j = 0; j < categoryIds.length; j++) {
        const categoryId = categoryIds[j]

        const filterIsSet =
          store.getters.filters[categoryId] &&
          filterValuesIsSet(store.getters.filters[categoryId])
        if (existingFeatures[j]) {
          features[categoryId] = previousFeatures[categoryId].map(
            (f: ApiPoi) => ({
              ...f,
              properties: {
                ...f.properties,
                vido_visible:
                  !filterIsSet ||
                  keepFeature(store.getters.filters[categoryId], f),
              },
            })
          )
        } else {
          const post = posts[i]

          features[categoryId] = post.features.map((f) => {
            f.properties.vido_cat = categoryId
            f.properties.vido_visible =
              !filterIsSet || keepFeature(store.getters.filters[categoryId], f)
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

  applyFilters(
    store: Store<State>,
    {
      categoryId,
      filterValues,
    }: { categoryId: number; filterValues: FilterValues }
  ) {
    const newFilters = copy(store.state.filters)
    if (!deepEqual(newFilters[categoryId], filterValues)) {
      newFilters[categoryId] = filterValues
      store.commit(Mutation.SET_FILTERS, { filters: newFilters })

      // Update features visibility
      const features: { [categoryId: number]: ApiPoi[] } = copy(
        store.getters.features
      )
      const filterIsSet = filterValuesIsSet(filterValues)
      Object.keys(features).forEach((categoryIdString: string) => {
        const categoryId = parseInt(categoryIdString, 10)
        features[categoryId] = features[categoryId].map((feature: ApiPoi) => {
          feature.properties.vido_visible =
            !filterIsSet || keepFeature(filterValues, feature)
          return feature
        })
      })
      store.commit(Mutation.SET_FEATURES, { features })
    }
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

  getRootCategoriesFromCategoryId: (state: State) => (categoryId: number) =>
    Object.values(state.categories)
      .filter(
        (c) =>
          c.parent_id !== null &&
          state.categories[c.parent_id]?.parent_id === null &&
          c.parent_id === categoryId
      )
      .sort((a, b) => a.index_order - b.index_order),

  categoryRootCategories: (state: State) =>
    Object.values(state.categories)
      .filter((c) => c.parent_id === null && c?.menu_group?.vido_children)
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
