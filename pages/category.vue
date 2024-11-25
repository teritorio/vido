<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import Header from '~/components/Layout/Header.vue'
import Footer from '~/components/Layout/Footer.vue'
import PoisTable from '~/components/PoisList/PoisTable.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'

//
// Composables
//
const siteStore = useSiteStore()
const { config, settings, contents } = storeToRefs(siteStore)
const menuStore = useMenuStore()
const { menuItems } = storeToRefs(menuStore)
const { $trackingInit } = useNuxtApp()
const { params, query, name } = useRoute()

//
// Computed
//
const categoryId = computed(() => {
  if (!params.id)
    return undefined

  return Number.parseInt(params.id as string)
})

const filters = computed(() => {
  return query.menuItemIds
    ? query.menuItemIds
      .toString()
      .split(',')
      .map(f => Number.parseInt(f))
    : undefined
})

const isEmbedded = computed(() => {
  return name?.toString().indexOf('embedded') !== -1
})

const isFiltersEqualToCategoryId = computed(() => {
  return filters.value?.length === 1 && filters.value[0] === categoryId.value
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
async function onCategoryUpdate(categoryId: number) {
  if (!categoryId)
    return

  await navigateTo({
    path: isEmbedded.value ? `/category/embedded/${categoryId}` : `/category/${categoryId}`,
    query,
  })
}
</script>

<template>
  <div v-if="isEmbedded">
    <CategorySelector
      v-if="!isFiltersEqualToCategoryId"
      class="pa-4"
      :filters="filters"
      :menu-items="menuItems || {}"
      :category-id="categoryId"
      @category-change="onCategoryUpdate"
    />
    <PoisTable :details-is-external="true" />
  </div>
  <VContainer v-else fluid>
    <Header
      class="mb-4"
      :theme="settings!.themes[0]"
      :nav-menu-entries="contents!"
    >
      <template #search>
        <CategorySelector
          class="w-50"
          :category-id="categoryId"
          :menu-items="menuItems || {}"
          @category-change="onCategoryUpdate"
        />
      </template>
    </Header>
    <PoisTable />
    <Footer :attributions="settings!.attributions" />
  </VContainer>
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
