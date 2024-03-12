<script setup lang="ts">
import type { ContentEntry } from '~/lib/apiContent'
import { getContents } from '~/lib/apiContent'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import { getPropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'
import { getSettings, headerFromSettings } from '~/lib/apiSettings'
import { menuStore as useMenuStore } from '~/stores/menu'
import Header from '~/components/Layout/Header.vue'
import Footer from '~/components/Layout/Footer.vue'
import PoisTable from '~/components/PoisList/PoisTable.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'

// Query param validation
definePageMeta({
  validate({ params }) {
    return (
      typeof params.id === 'string' && /^[,-_:a-zA-Z0-9]+$/.test(params.id)
    )
  },
})

const router = useRouter()
const param = useRoute().params
const id = Number.parseInt(param.id as string)
const menuStore = useMenuStore()
const { $settings, $propertyTranslations, $trackingInit } = useNuxtApp()

// Fetch config
// TODO: Do it on a higher level to share the config across pages
const { fetchConfig } = useConfig()
const config = fetchConfig()

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
    throw createError({ statusCode: 404, statusMessage: 'Global config not found.', fatal: true })

  categoryListData.value = data.value
}

// Fetch MenuItems by Cache or API
const { getMenuByCacheOrAPI } = useMenu()
await getMenuByCacheOrAPI(config)

const { settings, contents, translations } = categoryListData.value!
const category = menuStore.getCurrentCategory(id)

if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Category Not Found',
  })
}

settings.themes[0].title = category.category.name
useHead(headerFromSettings(settings))

// Not sure about future usage as we could have data from useNuxtData
$settings.set(settings)
$propertyTranslations.set(translations)

if (process.client)
  $trackingInit(config)

function onCategoryUpdate(categoryId: number) {
  if (!categoryId)
    return

  router.push(`/category/${categoryId}`)
}
</script>

<template>
  <VContainer fluid>
    <Header
      :theme="settings.themes[0]"
      :nav-menu-entries="contents"
    >
      <template #search>
        <CategorySelector
          class="w-50"
          :menu-items="menuStore.menuItems || {}"
          :category-id="id"
          @category-change="onCategoryUpdate"
        />
      </template>
    </Header>
    <PoisTable :category="category" />
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
