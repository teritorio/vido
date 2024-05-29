<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { headerFromSettings } from '~/lib/apiSettings'
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
const { config, settings, translations } = storeToRefs(siteStore)

// MenuItems
const menuStore = useMenuStore()
const { data, error } = await useFetch(`${config.value!.API_ENDPOINT}/${config.value!.API_PROJECT}/${config.value!.API_THEME}/menu.json`)

if (error.value)
  throw createError(error.value)

if (!data.value)
  throw createError({ statusCode: 404, statusMessage: 'Menu not found', fatal: true })

menuStore.fetchConfig(data.value)

const route = useRoute()
const { params, query } = route
const id = Number.parseInt(params.id as string)
const category = menuStore.getCurrentCategory(id)

if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Category Not Found',
  })
}

settings.value!.themes[0].title = category.category.name
useHead(headerFromSettings(settings.value!))

// Not sure about future usage as we could have data from useNuxtData
const { $settings, $propertyTranslations, $trackingInit } = useNuxtApp()
$settings.set(settings.value!)
$propertyTranslations.set(translations.value!)

// Get CategorySelector filters from Query params
const filters = computed(() => {
  return query.menuItemIds
    ? query.menuItemIds
      .toString()
      .split(',')
      .map(f => Number.parseInt(f))
    : undefined
})

const isFiltersEqualToCategoryId = computed(() => filters.value?.length === 1 && filters.value[0] === category.id)

if (process.client)
  $trackingInit(config.value!)

const router = useRouter()
function onCategoryUpdate(categoryId: number) {
  if (!categoryId)
    return

  router.push({ name: route.name?.toString(), params: { id: categoryId } })
}
</script>

<template>
  <CategorySelector
    v-if="!isFiltersEqualToCategoryId"
    class="pa-4"
    :filters="filters"
    :menu-items="menuStore.menuItems || {}"
    :category-id="id"
    @category-change="onCategoryUpdate"
  />
  <PoisTable :details-is-external="true" :category="category" />
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
