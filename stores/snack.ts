import { defineStore } from 'pinia'

interface Snack {
  time: number
  text: string
  textBtn: string
}

export const snackStore = defineStore('snack', () => {
  const snack = ref<Snack>()

  function showSnack(payload?: Snack) {
    snack.value = payload
    if (payload) {
      setTimeout(() => {
        snack.value = undefined
      }, payload.time)
    }
  }

  return {
    snack,
    showSnack,
  }
})
