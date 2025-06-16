<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import type { VBreadcrumbs } from 'vuetify/lib/components/index.mjs'
import type { MenuItem } from '~/lib/apiMenu'
import { useNavigationStore } from '~/stores/navigation'

const navigationStore = useNavigationStore()
const { navigationStack } = storeToRefs(navigationStore)

const breadcrumbsRef = ref<InstanceType<typeof VBreadcrumbs>>()

const breadcrumbsItems = computed(() => {
  return navigationStack.value.map((item) => {
    const menuItem = getMenuItem(item)

    return {
      title: menuItem.name.fr,
    }
  })
})

function getMenuItem(item: MenuItem) {
  return item.menu_group || item.link || item.category || {}
}

function checkScrollEnd() {
  if (!breadcrumbsRef.value)
    return

  const isAtEnd = breadcrumbsRef.value.$el.scrollWidth - breadcrumbsRef.value.$el.scrollLeft <= breadcrumbsRef.value.$el.clientWidth + 1
  breadcrumbsRef.value.$parent?.$el.classList.toggle('no-fade', isAtEnd)
}

onMounted(() => {
  if (!breadcrumbsRef.value)
    return

  breadcrumbsRef.value.$el.addEventListener('scroll', checkScrollEnd)
})

onBeforeUnmount(() => {
  if (!breadcrumbsRef.value)
    return

  breadcrumbsRef.value.$el.removeEventListener('scroll', checkScrollEnd)
})
</script>

<template>
  <div class="breadcrumbs-wrapper">
    <VBreadcrumbs ref="breadcrumbsRef" :items="breadcrumbsItems" density="comfortable">
      <template #prepend>
        <FontAwesomeIcon
          icon="arrow-left"
          size="lg"
          @click="navigationStore.goBack()"
        />
      </template>
      <template #item="{ item, index }">
        <VBreadcrumbsItem @click="navigationStore.navigateTo(navigationStack[index])">
          {{ item.title }}
        </VBreadcrumbsItem>
      </template>
    </VBreadcrumbs>
  </div>
</template>

<style lang="css" scoped>
.breadcrumbs-wrapper {
  position: relative;
}

.breadcrumbs-wrapper::after {
  content: "";
  position: absolute;
  top: 0;
  right: -2px;
  height: 100%;
  width: 3rem;
  pointer-events: none;
  background: linear-gradient(to right, rgb(255 255 255 / 0%), rgb(255 255 255 / 60%), #fff);
  transition: opacity 0.3s ease;
  opacity: 1;
}

.breadcrumbs-wrapper.no-fade::after {
  opacity: 0;
}

.v-breadcrumbs {
  overflow-x: auto;
  line-height: unset;
}

:deep(.v-breadcrumbs__prepend) {
  margin-right: 0.25rem;
}

.v-breadcrumbs-item {
  flex-shrink: 0;
}
</style>
