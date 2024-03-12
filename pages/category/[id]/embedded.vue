<script setup lang="ts">
// Query param validation
definePageMeta({
  validate({ params }) {
    return (
      typeof params.id === 'string' && /^[,-_:a-zA-Z0-9]+$/.test(params.id)
    )
  },
})

// Fetch config
// TODO: Do it on a higher level to share the config across pages
const { fetchConfig } = useConfig()
const config = fetchConfig()
const id = null

// Fetch MenuItems by Cache or API
const { getMenuByCacheOrAPI } = useMenu()
await getMenuByCacheOrAPI(config)

const router = useRouter()
function onCategoryUpdate(categoryId: number) {
  if (!categoryId)
    return

  router.push(`/category/${categoryId}`)
}
</script>

<template>
  <CategorySelector
    class="w-50"
    :menu-items="menuStore.menuItems"
    :category-id="id"
    @category-change="onCategoryUpdate"
  />
</template>
