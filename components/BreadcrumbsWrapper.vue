<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import type { MenuItem } from '~/types/local/menu'
import { useNavigationStore } from '~/stores/navigation'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import type { RouteLocationRaw } from '#vue-router'
import type { TextColors } from '~/lib/apiPois'

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
    colorText: TextColors
    size: string
  }
}

const items = computed(() => {
  return navigationStack.value.map((item) => {
    return getTeritorioIconBadgeProps(item)
  })
})

function getItem(item: MenuItem) {
  if ('menu_group' in item)
    return item.menu_group

  if ('link' in item)
    return item.link

  return item.category
}

function getTeritorioIconBadgeProps(item: MenuItem): CustomBreadcrumbItem {
  const base = getItem(item)
  const { colorFill, colorText } = useContrastedColors(base.color_fill)

  return {
    icon: {
      id: item.id,
      picto: base.icon,
      colorFill: colorFill.value,
      colorText: colorText.value,
      size: 'md',
    },
    title: base.name.fr || '',
  }
}
</script>

<template>
  <VBreadcrumbs :items="items" density="compact">
    <template #prepend>
      <VBtn
        variant="text"
        density="compact"
        :title="$t('headerMenu.back')"
        @click="navigationStore.goBack()"
      >
        <FontAwesomeIcon
          icon="arrow-left"
          size="lg"
        />
      </VBtn>
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
  padding-left: 0;
  padding-right: 0;
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
  cursor: pointer;
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
