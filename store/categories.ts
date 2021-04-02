import concat from 'lodash.concat'
import without from 'lodash.without'
import { Store } from 'vuex'

import { Class } from '@/utils/types'

enum Mutation {
  SELECT_SUB_CATEGORY = 'SELECT_SUB_CATEGORY',
  UNSELECT_SUB_CATEGORY = 'UNSELECT_SUB_CATEGORY',
}

interface State {
  selectedSubCategories: Class['id'][]
}

export const state = (): State => ({
  selectedSubCategories: [],
})

export const mutations = {
  [Mutation.SELECT_SUB_CATEGORY](
    state: State,
    payload: Class['id'] | Class['id'][]
  ) {
    state.selectedSubCategories = concat(state.selectedSubCategories, payload)
  },

  [Mutation.UNSELECT_SUB_CATEGORY](
    state: State,
    payload: Class['id'] | Class['id'][]
  ) {
    if (Array.isArray(payload)) {
      state.selectedSubCategories = without(
        state.selectedSubCategories,
        ...payload
      )
    } else {
      state.selectedSubCategories = without(
        state.selectedSubCategories,
        payload
      )
    }
  },
}

export const actions = {
  selectSubCategory(store: Store<State>, subCategoryId: Class['id']) {
    store.commit(Mutation.SELECT_SUB_CATEGORY, subCategoryId)
  },

  toggleSubCategorySelection(store: Store<State>, subCategoryId: Class['id']) {
    if (store.getters.isSubCategorySelected(subCategoryId)) {
      store.commit(Mutation.UNSELECT_SUB_CATEGORY, subCategoryId)
    } else {
      store.commit(Mutation.SELECT_SUB_CATEGORY, subCategoryId)
    }
  },

  unselectSubCategory(store: Store<State>, subCategoryId: Class['id']) {
    store.commit(Mutation.UNSELECT_SUB_CATEGORY, subCategoryId)
  },
}

export const getters = {
  isSubCategorySelected: (state: State) => (subCategoryId: Class['id']) =>
    state.selectedSubCategories.includes(subCategoryId),

  selectedSubCategories: (state: State) => state.selectedSubCategories,
}
