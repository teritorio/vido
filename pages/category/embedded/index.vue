<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { vidoConfig } from '~/plugins/vido-config'
import { type PropertyTranslations, getPropertyTranslations } from '~/lib/apiPropertyTranslations'
import { type Settings, getSettings, headerFromSettings } from '~/lib/apiSettings'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import PoisTable from '~/components/PoisList/PoisTable.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'

const siteStore = useSiteStore()
const { $vidoConfigSet, $settings, $propertyTranslations, $trackingInit } = useNuxtApp()
const menuStore = useMenuStore()
const { menuItems } = storeToRefs(menuStore)

// TODO: Get this globally as share it across components / pages
let config = siteStore.config

if (process.server && !config) {
  config = vidoConfig(useRequestHeaders())
  $vidoConfigSet(config)
  siteStore.$patch({ config })
}

if (!config)
  throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

// Fetch common data
// TODO: Move common data on upper-level (ex: layout)
const categoryListData = ref<{
  settings: Settings
  translations: PropertyTranslations
}>()
const { data: cachedCategoryListData } = useNuxtData('categoryList')

if (cachedCategoryListData.value) {
  categoryListData.value = cachedCategoryListData.value
}
else {
  const { data, error } = await useAsyncData('categoryList', async () => {
    const [settings, translations] = await Promise.all([
      getSettings(config!),
      getPropertyTranslations(config!),
    ])

    return { settings, translations }
  })

  if (error.value || !data.value)
    throw createError({ statusCode: 500, statusMessage: 'Global config not found.', fatal: true })

  categoryListData.value = data.value
}

const { settings, translations } = categoryListData.value!
useHead(headerFromSettings(settings))

// Not sure about future usage as we could have data from useNuxtData
$settings.set(settings)
$propertyTranslations.set(translations)

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
  $trackingInit(config)

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
