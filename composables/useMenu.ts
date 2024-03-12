import { getMenu } from '~/lib/apiMenu'
import { menuStore as useMenuStore } from '~/stores/menu'

export default function () {
  async function getMenuByCacheOrAPI() {
    const menuStore = useMenuStore()
    const { data: cachedMenuItems } = useNuxtData('menu-items')

    if (cachedMenuItems.value) {
      menuStore.fetchConfig(cachedMenuItems.value)
    }
    else {
      const { data, error } = await useAsyncData('menu-items', async () => await getMenu(config!))

      if (error.value || !data.value)
        throw createError({ statusCode: 404, statusMessage: 'Menu not found', fatal: true })

      menuStore.fetchConfig(data.value)
    }
  }

  return {
    getMenuByCacheOrAPI,
  }
}
