import { defineStore } from 'pinia'

export const STORE_NAME = 'contrib'

interface State {
  enabled: boolean
}

export const useContribStore = defineStore(STORE_NAME, {
  state: (): State => ({
    enabled: false,
  }),
  actions: {
    setEnabled(state: boolean) {
      this.enabled = state
      localStorage.setItem(STORE_NAME, JSON.stringify(state))
    },
  },
})
