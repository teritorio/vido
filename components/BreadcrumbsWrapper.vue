<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import type { MenuItem } from '~/lib/apiMenu'
import { useNavigationStore } from '~/stores/navigation'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import type { RouteLocationRaw } from '#vue-router'

const navigationStore = useNavigationStore()
const { navigationStack } = storeToRefs(navigationStore)

interface LinkProps {
  href: string | undefined
  replace: boolean | undefined
  to: RouteLocationRaw | undefined
  exact: boolean | undefined
}

type InternalBreadcrumbItem = Partial<LinkProps> & {
  title: string
  disabled?: boolean
}

type CustomBreadcrumbItem = InternalBreadcrumbItem & {
  icon: {
    id: number
    picto: string
    colorFill: string
    colorText: string
    size: string
  }
}

const items = computed(() => {
  return navigationStack.value.map((item) => {
    const base = getItem(item)
    const { colorFill, colorText } = getContrastedColors(base.color_fill, base.color_text)

    return {
      icon: {
        id: item.id,
        picto: base.icon,
        colorFill,
        colorText,
        size: 'sm',
      },
      title: base.name.fr,
    } satisfies CustomBreadcrumbItem
  })
})

function getItem(item: MenuItem) {
  return item.menu_group || item.link || item.category || {}
}
</script>

<template>
  <VBreadcrumbs :items="items" density="comfortable">
    <template #prepend>
      <FontAwesomeIcon
        icon="arrow-left"
        size="lg"
        @click="navigationStore.goBack()"
      />
    </template>
    <template #item="{ item, index }">
      <VBreadcrumbsItem @click="navigationStore.navigateTo(navigationStack[index])">
        <TeritorioIconBadge v-bind="(item as CustomBreadcrumbItem).icon" />
        <span v-if="index === navigationStack.length - 1">
          {{ item.title }}
        </span>
      </VBreadcrumbsItem>
    </template>
  </VBreadcrumbs>
</template>

<style lang="css" scoped>
.v-breadcrumbs {
  line-height: unset;
}

:deep(.v-breadcrumbs__prepend) {
  margin-right: 0.25rem;
}

:deep(.v-breadcrumbs-divider) {
  padding: 0 4px;
}

.v-breadcrumbs-item {
  font-size: 0.88rem;
  gap: 0.5rem;
  overflow: hidden;
  padding: 0;
  min-width: 32px;
}

.v-breadcrumbs-item span:last-of-type {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-breadcrumbs-item:last-of-type {
  font-weight: 500;
}
</style>
