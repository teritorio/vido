import { Store } from 'vuex'

import {
  ApiCategoryBase,
  ApiPosts,
  Category,
  OsmFeature,
  TisFeature,
} from '@/utils/types'

enum Mutation {
  SET_CONFIG = 'SET_CONFIG',
  SET_FEATURES = 'SET_FEATURES',
}

interface State {
  categories: Category[]
  isLoaded: boolean
  features: {
    [categoryId: string]: {
      osm: OsmFeature[]
      tis: TisFeature[]
    }
  }
}

export const state = (): State => ({
  categories: [],
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
  async fetchConfig(store: Store<State>, apiOrigin: string) {
    try {
      const configPromise = await fetch(`${apiOrigin}/geodata/v1/menu`)

      const config: {
        [id: string]: ApiCategoryBase
      } = await configPromise.json()

      const categories = Object.values(config).filter(
        (category) => category.isDataItem === true
      )

      store.commit(Mutation.SET_CONFIG, { categories })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Vido error: Unable to fetch the menu config from the API',
        error
      )
    }
  },

  async fetchFeatures(store: Store<State>, categoryIds: Category['id'][]) {
    try {
      const posts: ApiPosts[] = await Promise.all(
        categoryIds.map((categoryId) =>
          fetch(
            `https://demov2.teritorio.xyz/api.teritorio/geodata/v1/posts?idmenu=${categoryId}`
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
