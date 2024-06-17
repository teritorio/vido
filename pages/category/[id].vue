<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { headerFromSettings } from '~/lib/apiSettings'
import { menuStore as useMenuStore } from '~/stores/menu'
import { siteStore as useSiteStore } from '~/stores/site'
import Header from '~/components/Layout/Header.vue'
import Footer from '~/components/Layout/Footer.vue'
import PoisTable from '~/components/PoisList/PoisTable.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'

//
// Validators
//
definePageMeta({
  validate({ params }) {
    return (
      typeof params.id === 'string' && /^[-\w:,]+$/.test(params.id)
    )
  },
})

//
// Composables
//
const siteStore = useSiteStore()
const { config, settings, contents } = storeToRefs(siteStore)
const menuStore = useMenuStore()
const { menuItems } = storeToRefs(menuStore)
const { params } = useRoute()
const router = useRouter()
const id = Number.parseInt(params.id as string)
const { $trackingInit } = useNuxtApp()

const category = menuStore.getCurrentCategory(id)
if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Category Not Found',
  })
}

useHead(headerFromSettings(settings.value!, { title: category.category.name.fr }))

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
          :menu-items="menuItems || {}"
          :category-id="id"
          @category-change="onCategoryUpdate"
        />
      </template>
    </Header>
    <PoisTable :category="category" />
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
