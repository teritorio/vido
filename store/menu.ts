import { Store } from 'vuex'

import { ApiPosts, Category, OsmFeature, TisFeature } from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SET_FEATURES = 'SET_FEATURES',
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
    [categoryId: string]: {
      osm: OsmFeature[]
      tis: TisFeature[]
    }
  }
}

export const state = (): State => ({
  categories: {},
  isLoaded: false,
  features: {},
})

export const mutations = {
  [Mutation.SET_CONFIG](state: State, payload: State) {
    state.categories = payload.categories

    state.isLoaded = true
  },

  [Mutation.SET_FEATURES](state: State, payload: State) {
    state.features = payload.features
  },
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
        .forEach((category) => (categories[category.id] = category))

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

        features[categoryId] = {
          osm: post.osm?.[0].FeaturesCollection.features || [],
          tis: post.tis?.[0].FeaturesCollection.features || [],
        }
      })

      store.commit(Mutation.SET_FEATURES, { features })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Vido error: Unable to fetch the features from the API',
        error
      )
    }
  },
}

export const getters = {
  categories: (state: State) => state.categories,
  features: (state: State) => state.features,
  isLoaded: (state: State) => state.isLoaded,

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
