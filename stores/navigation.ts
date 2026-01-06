import { defineStore } from 'pinia'
import type { ApiMenuCategory } from '~/types/api/menu'
import type { MenuItem } from '~/types/local/menu'

export const useNavigationStore = defineStore('navigation', () => {
  const navigationStack = ref<MenuItem[]>([])
  const categoryIdFilter = ref<ApiMenuCategory['id'] | null>(null)

  const currentParent = computed(() => navigationStack.value.at(-1))
  const isRootMenu = computed(() => navigationStack.value.length === 0)

  function goBack() {
    navigationStack.value.pop()
  }

  function navigateTo(item: MenuItem) {
    const hasItemIndex = navigationStack.value.findIndex(i => i.id === item.id)
    if (hasItemIndex > -1) {
      navigationStack.value.splice(hasItemIndex + 1)
    }
    else {
      navigationStack.value.push(item)
    }
  }

  function setCategoryFilter(id: ApiMenuCategory['id'] | null) {
    categoryIdFilter.value = id
  }

  function resetNavigation() {
    navigationStack.value = []
    categoryIdFilter.value = null
  }

  return {
    navigationStack,
    categoryIdFilter,
    currentParent,
    isRootMenu,
    goBack,
    navigateTo,
    setCategoryFilter,
    resetNavigation,
  }
})
