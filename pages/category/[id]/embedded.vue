<script setup lang="ts">
console.log('Embedded PAGE')
// Query param validation
definePageMeta({
  validate({ params }) {
    return (
      typeof params.id === 'string' && /^[,-_:a-zA-Z0-9]+$/.test(params.id)
    )
  },
})

// Fetch config
// TODO: Do it on High Level to share the config accors pages
// const { fetchConfig } = useConfig()
// const config = fetchConfig()

// // Fetch MenuItems by Cache or API
// const { getMenuByCacheOrAPI } = useMenu()
// await getMenuByCacheOrAPI(config)

// const router = useRouter()
// function onCategoryUpdate(categoryId: number) {
//   if (!categoryId)
//     return

//   router.push(`/category/${categoryId}`)
// }
</script>

<template>
  <h1>Welcome Embedded</h1>
  <!-- <CategorySelector
    class="w-50"
    :menu-items="menuStore.menuItems"
    :category-id="id"
    @category-change="onCategoryUpdate"
  /> -->
</template>
