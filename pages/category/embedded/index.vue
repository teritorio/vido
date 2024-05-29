<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { siteStore as useSiteStore } from '~/stores/site'
import { headerFromSettings } from '~/lib/apiSettings'
import { menuStore as useMenuStore } from '~/stores/menu'
import PoisTable from '~/components/PoisList/PoisTable.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'

const menuStore = useMenuStore()
const { menuItems } = storeToRefs(menuStore)
const siteStore = useSiteStore()
const { config, settings, translations } = storeToRefs(siteStore)

useHead(headerFromSettings(settings.value!))

// Not sure about future usage as we could have data from useNuxtData
const { $settings, $propertyTranslations, $trackingInit } = useNuxtApp()
$settings.set(settings.value!)
$propertyTranslations.set(translations.value!)

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

if (process.client)
  $trackingInit(config.value!)

const router = useRouter()
function onCategoryUpdate(categoryId: number) {
  if (!categoryId)
    return

  router.push({ query: route.query, path: `/category/embedded/${categoryId}` })
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
