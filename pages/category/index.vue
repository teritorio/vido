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
const router = useRouter()

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
