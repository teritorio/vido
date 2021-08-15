import { Store } from 'vuex'

enum Mutation {
  SHOW_SNACK = 'SHOW_SNACK',
}

export interface Snack {
  time: number
  text: string
  textBtn: string
}

export interface State {
  snack: Snack
}

export const state = (): State => ({
  snack: {
    time: 3000,
    text: '',
    textBtn: '',
  },
})

export const getters = {
  snack: (state: State) => state.snack,
}

export const mutations = {
  [Mutation.SHOW_SNACK](state: State, payload: Snack) {
    state.snack = payload
  },
}

export const actions = {
  showSnack(store: Store<State>, payload: State) {
    const options = { ...state().snack, ...payload }
    store.commit(Mutation.SHOW_SNACK, options)
    setTimeout(() => {
      store.commit(Mutation.SHOW_SNACK, null)
    }, options.time)
  },
}
