<script setup lang="ts">
import { getContents } from '~/lib/apiContent'
import { getMenu } from '~/lib/apiMenu'
import { getPropertyTranslations } from '~/lib/apiPropertyTranslations'
import { getSettings, headerFromSettings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
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
const siteStore = useSiteStore()
const menuStore = useMenuStore()
const { $vidoConfigSet, $settings, $propertyTranslations, $trackingInit } = useNuxtApp()

// TODO: Get this globally as share it across components / pages
let config = siteStore.config

if (process.server) {
  config = vidoConfig(useRequestHeaders())
  $vidoConfigSet(config)
  siteStore.$patch({ config })
}

if (!config)
  throw createError({ statusCode: 404, statusMessage: 'Wrong config', fatal: true })

// Fetch common data
// TODO: Move common data on upper-level (ex: layout)
const { data, error } = await useLazyAsyncData('categoryList', async () => {
  const [settings, contents, translations] = await Promise.all([
    getSettings(config!),
    getContents(config!),
    getPropertyTranslations(config!),
    getMenu(config!).then((menu) => {
      menuStore.fetchConfig(menu)
      return menu
    }),
  ])

  return { settings, contents, translations }
})

if (error.value || !data.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found.', fatal: true })

const { settings, contents, translations } = data.value
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
  router.push(`/category/${categoryId}`)
}
</script>

<template>
  <VContainer fluid>
    <Header
      :theme="settings.themes[0]"
      :nav-menu-entries="contents"
      :color-line="category?.category.color_line"
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
