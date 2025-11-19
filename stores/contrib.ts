import { defineStore } from 'pinia'

export const STORE_NAME = 'contrib'

export const useContribStore = defineStore(STORE_NAME, () => {
  const enabled = ref<boolean>(false)

  function setEnabled(state: boolean): void {
    const cookie = useCookie(STORE_NAME)

    enabled.value = state
    cookie.value = JSON.stringify(state)
  }

  return {
    enabled,
    setEnabled,
  }
})
