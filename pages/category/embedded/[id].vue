<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import PoisTable from '~/components/PoisList/PoisTable.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'

// Query param validation
definePageMeta({
  validate({ params }) {
    return (
      typeof params.id === 'string' && /^[-\w:,]+$/.test(params.id)
    )
  },
})

const siteStore = useSiteStore()
const { config } = storeToRefs(siteStore)
const { $trackingInit } = useNuxtApp()
const menuStore = useMenuStore()
const { menuItems } = storeToRefs(menuStore)
const param = useRoute().params
const id = Number.parseInt(param.id as string)
const category = menuStore.getCurrentCategory(id)

if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Category Not Found',
  })
}

// Get CategorySelector filters from Query params
const route = useRoute()
const filters = computed(() => {
  return route.query.menuItemIds
    ? route.query.menuItemIds
      .toString()
      .split(',')
      .map(f => Number.parseInt(f))
    : undefined
})

const isFiltersEqualToCategoryId = filters.value?.length === 1 && filters.value[0] === category.id

onBeforeMount(() => {
  $trackingInit(config.value!)
})

const router = useRouter()
function onCategoryUpdate(categoryId: number) {
  if (!categoryId)
    return

  router.push({ name: route.name?.toString(), params: { id: categoryId } })
}
</script>

<template>
  <div>
    <CategorySelector
      v-if="!isFiltersEqualToCategoryId"
      class="pa-4"
      :filters="filters"
      :menu-items="menuItems || {}"
      :category-id="id"
      @category-change="onCategoryUpdate"
    />
    <PoisTable :details-is-external="true" :category="category" />
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
