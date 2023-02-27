import { defineStore } from 'pinia'

interface Snack {
  time: number
  text: string
  textBtn: string
}

interface State {
  snack: Snack | null
}

export const snackStore = defineStore('snack', {
  state: (): State => ({
    snack: null,
  }),

  actions: {
    showSnack(payload: Snack | null) {
      this.snack = payload
      if (payload) {
        setTimeout(() => {
          this.snack = null
        }, payload.time)
      }
    },
  },
})
