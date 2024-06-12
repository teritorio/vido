<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { vidoConfig } from '~/plugins/vido-config'
import { type ContentEntry, getContents } from '~/lib/apiContent'
import { type PropertyTranslations, getPropertyTranslations } from '~/lib/apiPropertyTranslations'
import { type Settings, getSettings, headerFromSettings } from '~/lib/apiSettings'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import Header from '~/components/Layout/Header.vue'
import Footer from '~/components/Layout/Footer.vue'
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
  contents: ContentEntry[]
  translations: PropertyTranslations
}>()
const { data: cachedCategoryListData } = useNuxtData('categoryList')

if (cachedCategoryListData.value) {
  categoryListData.value = cachedCategoryListData.value
}
else {
  const { data, error } = await useAsyncData('categoryList', async () => {
    const [settings, contents, translations] = await Promise.all([
      getSettings(config!),
      getContents(config!),
      getPropertyTranslations(config!),
    ])

    return { settings, contents, translations }
  })

  if (error.value || !data.value)
    throw createError({ statusCode: 500, statusMessage: 'Global config not found.', fatal: true })

  categoryListData.value = data.value
}

const { settings, contents, translations } = categoryListData.value!
useHead(headerFromSettings(settings))

// Not sure about future usage as we could have data from useNuxtData
$settings.set(settings)
$propertyTranslations.set(translations)

if (process.client)
  $trackingInit(config)

const router = useRouter()
function onCategoryUpdate(categoryId: number) {
  if (!categoryId)
    return

  router.push(`/category/${categoryId}`)
}
</script>

<template>
  <VContainer fluid>
    <Header
      class="mb-4"
      :theme="settings.themes[0]"
      :nav-menu-entries="contents"
    >
      <template #search>
        <CategorySelector
          class="w-50"
          :menu-items="menuItems || {}"
          @category-change="onCategoryUpdate"
        />
      </template>
    </Header>
    <PoisTable />
    <Footer :attributions="settings.attributions" />
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
