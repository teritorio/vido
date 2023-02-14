import copy from 'fast-copy'
import { deepEqual } from 'fast-equals'
import { Store } from 'vuex'

import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { ApiPoi, ApiPois, getPoiByCategoryId } from '~/lib/apiPois'
import {
  FilterValues,
  filterValueFactory,
  filterValuesIsSet,
} from '~/utils/types-filters'

enum Mutation {
  SET_MENU_ITEM = 'SET_MENU_ITEM',
  SET_SELECTED_CATEGORY_IDS = 'SET_SELECTED_CATEGORY_IDS',
  ADD_SELECTED_CATEGORY_IDS = 'ADD_SELECTED_CATEGORY_IDS',
  DEL_SELECTED_CATEGORY_IDS = 'DEL_SELECTED_CATEGORY_IDS',
  TOOGLE_SELECTED_CATEGORY_ID = 'TOOGLE_SELECTED_CATEGORY_ID',
  SET_FEATURES = 'SET_FEATURES',
  SET_FILTERS = 'SET_FILTERS',
  SET_FEATURES_LOADING = 'SET_FEATURES_LOADING',
  SET_ALL_FEATURES = 'SET_ALL_FEATURES',
}

interface FetchConfigPayload {
  menuItems: MenuItem[]
}

interface FetchFeaturesPayload {
  apiEndpoint: string
  apiProject: string
  apiTheme: string
  categoryIds: ApiMenuCategory['id'][]
}

export interface State {
  menuItems:
    | {
        [menuItemId: number]: MenuItem
      }
    | undefined
  selectedCatagoryIds: ApiMenuCategory['id'][]
  features: {
    [key: number]: ApiPoi[]
  }
  allFeatures: {
    [key: number]: ApiPoi[]
  }
  filters: Record<ApiMenuCategory['id'], FilterValues>
  isLoadingFeatures: boolean
}

export const state = (): State => ({
  menuItems: undefined,
  selectedCatagoryIds: [],
  features: {},
  filters: {},
  allFeatures: {},
  isLoadingFeatures: false,
})

function sortedUniq<T>(a: T[]): T[] {
  return [...new Set(a)].sort()
}

export const mutations = {
  [Mutation.SET_MENU_ITEM](state: State, payload: State) {
    state.menuItems = payload.menuItems
  },

  [Mutation.SET_SELECTED_CATEGORY_IDS](state: State, payload: State) {
    state.selectedCatagoryIds = payload.selectedCatagoryIds
  },

  [Mutation.ADD_SELECTED_CATEGORY_IDS](state: State, payload: State) {
    state.selectedCatagoryIds = sortedUniq([
      ...state.selectedCatagoryIds,
      ...payload.selectedCatagoryIds,
    ])
  },

  [Mutation.DEL_SELECTED_CATEGORY_IDS](state: State, payload: State) {
    state.selectedCatagoryIds = state.selectedCatagoryIds.filter(
      (categoryId) => !payload.selectedCatagoryIds.includes(categoryId)
    )
  },

  [Mutation.TOOGLE_SELECTED_CATEGORY_ID](state: State, payload: State) {
    if (state.selectedCatagoryIds.includes(payload.selectedCatagoryIds[0])) {
      state.selectedCatagoryIds = state.selectedCatagoryIds.filter(
        (id) => id !== payload.selectedCatagoryIds[0]
      )
    } else {
      state.selectedCatagoryIds = sortedUniq([
        ...state.selectedCatagoryIds,
        payload.selectedCatagoryIds[0],
      ])
    }
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
  return filters.reduce<boolean>((prevValue, filter) => {
    return prevValue && (!filter.isSet() || filter.isMatch(feature.properties))
  }, true)
}

export const actions = {
  setSelectedCategoryIds(
    store: Store<State>,
    selectedCatagoryIds: ApiMenuCategory['id'][]
  ) {
    store.commit(Mutation.SET_SELECTED_CATEGORY_IDS, {
      selectedCatagoryIds: selectedCatagoryIds,
    })
  },

  addSelectedCategoryIds(
    store: Store<State>,
    selectedCatagoryIds: ApiMenuCategory['id'][]
  ) {
    store.commit(Mutation.ADD_SELECTED_CATEGORY_IDS, {
      selectedCatagoryIds: selectedCatagoryIds,
    })
  },

  delSelectedCategoryIds(
    store: Store<State>,
    selectedCatagoryIds: ApiMenuCategory['id'][]
  ) {
    store.commit(Mutation.DEL_SELECTED_CATEGORY_IDS, {
      selectedCatagoryIds: selectedCatagoryIds,
    })
  },

  clearSelectedCategoryIds(store: Store<State>) {
    store.commit(Mutation.SET_SELECTED_CATEGORY_IDS, {
      selectedCatagoryIds: [],
    })
  },

  toggleSelectedCategoryId(
    store: Store<State>,
    categoryId: ApiMenuCategory['id']
  ) {
    store.commit(Mutation.TOOGLE_SELECTED_CATEGORY_ID, {
      selectedCatagoryIds: [categoryId],
    })
  },

  fetchConfig(store: Store<State>, { menuItems }: FetchConfigPayload) {
    try {
      const stateMenuItems: State['menuItems'] = {}
      const filters: Record<ApiMenuCategory['id'], FilterValues> = {}

      store.commit(Mutation.SET_MENU_ITEM, { menuItems: null }) // Hack, release from store before edit and reappend
      menuItems
        .filter((menuItem) => !menuItem.hidden)
        .map((menuItem) => {
          stateMenuItems[menuItem.id] = menuItem
          return menuItem
        })
        .forEach((menuItem) => {
          // Separated from previous map to allow batch processing and make sure parent category is always there
          // Associate to parent_id
          if (menuItem.parent_id && menuItem.parent_id !== null) {
            const parent = stateMenuItems[menuItem.parent_id]
            if (parent?.menu_group) {
              if (!parent.menu_group.vido_children) {
                parent.menu_group.vido_children = []
              }
              parent.menu_group.vido_children.push(menuItem.id)
            }
          }

          if (menuItem.category?.filters) {
            filters[menuItem.id] = menuItem.category?.filters.map((filter) =>
              filterValueFactory(filter)
            )
          }
        })
      store.commit(Mutation.SET_MENU_ITEM, { menuItems: stateMenuItems })
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
      features[categoryId] = features[categoryId].map((feature: ApiPoi) => {
        feature.properties.vido_visible =
          !filterIsSet || keepFeature(filterValues, feature)
        return feature
      })
      store.commit(Mutation.SET_FEATURES, { features })
    }
  },
}

export const getters = {
  menuItems: (state: State): { [menuItemId: number]: MenuItem } | undefined =>
    state.menuItems,
  selectedCategoryIds: (state: State): ApiMenuCategory['id'][] =>
    state.selectedCatagoryIds,
  selectedCategories: (state: State): ApiMenuCategory[] | undefined => {
    return state.menuItems === undefined
      ? undefined
      : (state.selectedCatagoryIds
          .map((selectedCatagoryId) => state.menuItems![selectedCatagoryId])
          .filter((menuItems) => menuItems !== undefined) as ApiMenuCategory[])
  },
  allFeatures: (state: State) => state.allFeatures,
  isLoadingFeatures: (state: State) => state.isLoadingFeatures,
  filters: (state: State) => state.filters,
  features: (state: State) => state.features,
}
