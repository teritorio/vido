<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import PoisTable from '~/components/PoisList/PoisTable.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'

//
// Composables
const siteStore = useSiteStore()
const { config } = storeToRefs(siteStore)
const menuStore = useMenuStore()
const { menuItems } = storeToRefs(menuStore)
const { $trackingInit } = useNuxtApp()
const { query } = useRoute()
const router = useRouter()

//
// Computed
//
const filters = computed(() => {
  return query.menuItemIds
    ? query.menuItemIds
      .toString()
      .split(',')
      .map(f => Number.parseInt(f))
    : undefined
})

//
// Hooks
//
onBeforeMount(() => {
  $trackingInit(config.value!)
})

//
// Methods
//
function onCategoryUpdate(categoryId: number) {
  if (!categoryId)
    return

  router.push({ query, path: `/category/embedded/${categoryId}` })
}
</script>

<template>
  <div>
    <CategorySelector
      class="pa-4"
      :filters="filters"
      :menu-items="menuItems || {}"
      @category-change="onCategoryUpdate"
    />
    <PoisTable :details-is-external="true" />
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/details';

.page-index {
  color: $color-text;
  background-color: #fefefe;
  padding: 1rem;
  min-width: 21rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizelegibility;
  line-height: 1.3;
  word-wrap: break-word;

  @extend %font-light;
}
</style>
