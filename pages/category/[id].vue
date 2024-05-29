<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import { headerFromSettings } from '~/lib/apiSettings'
import Header from '~/components/Layout/Header.vue'
import Footer from '~/components/Layout/Footer.vue'
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
const { config, settings, contents, translations } = storeToRefs(siteStore)

// MenuItems
const menuStore = useMenuStore()
const { data, error } = await useFetch(`${config.value!.API_ENDPOINT}/${config.value!.API_PROJECT}/${config.value!.API_THEME}/menu.json`)

if (error.value)
  throw createError(error.value)

if (!data.value)
  throw createError({ statusCode: 404, statusMessage: 'Menu not found', fatal: true })

menuStore.fetchConfig(data.value)

const { params } = useRoute()
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

if (process.client)
  $trackingInit(config.value!)

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
      :theme="settings!.themes[0]"
      :nav-menu-entries="contents!"
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
