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
      const cookie = useCookie(STORE_NAME)

      this.enabled = state
      cookie.value = JSON.stringify(state)
    },
  },
})
