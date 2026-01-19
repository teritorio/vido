<script setup lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Item from '~/components/Menu/Item.vue'
import type { ApiMenuItem } from '~/types/api/menu'
import type { MenuCategory } from '~/types/local/menu'
import type { FilterValues } from '~/utils/types-filters'
import { filterValuesIsSet } from '~/utils/types-filters'

const props = defineProps<{
  category: MenuCategory
  filters?: FilterValues
  selected: boolean
  size: FontAwesomeIconProps['size']
  displayModeDefault: 'compact' | 'large'
}>()

const emit = defineEmits<{
  (e: 'click', category_id: ApiMenuItem['id']): true
  (e: 'filterClick', category_id: ApiMenuItem['id']): true
}>()

const { t } = useI18n()
const { $tracking } = useNuxtApp()
const { colorFill, colorText } = useContrastedColors(props.category.category.color_fill)

const isFiltered = computed((): boolean | undefined => {
  return props.filters && filterValuesIsSet(props.filters)
})

const menuItemProps = computed(() => {
  return {
    id: `MenuItem-${props.category.id}`,
    href: `/${props.category.id}`,
    displayMode: props.category.category.display_mode || props.displayModeDefault,
    colorFill: colorFill.value,
    colorText: colorText.value,
    icon: props.category.category.icon,
    size: props.size,
    name: props.category.category.name,
  }
})

function onClick() {
  $tracking({
    type: 'category_event',
    event: 'enable',
    categoryId: props.category.id,
    title: props.category.category.name.fr || '',
  })

  emit('click', props.category.id)
}

function onFilterClick() {
  $tracking({
    type: 'category_event',
    event: 'filter',
    categoryId: props.category.id,
    title: props.category.category.name.fr || '',
  })
  emit('filterClick', props.category.id)
}
</script>

<template>
  <Item
    v-bind="menuItemProps"
    badge-class="tw-bg-white tw-text-zinc-700 tw-rounded-full tw-border-solid tw-border-2 tw-border-white"
    @click.prevent="onClick"
  >
    <template v-if="category.category.display_mode === 'compact'" #badge>
      <FontAwesomeIcon
        v-if="!selected"
        class="tw-text-zinc-300"
        :icon="['far', 'circle']"
        :size="size"
      />
      <FontAwesomeIcon
        v-else
        class="tw-text-emerald-500"
        icon="check-circle"
        :size="size"
      />
    </template>

    <template #end-line-large>
      <FontAwesomeIcon
        v-if="!selected"
        class="tw-text-zinc-300"
        :icon="['far', 'circle']"
        :size="size"
      />
      <FontAwesomeIcon
        v-else
        class="tw-text-emerald-500"
        icon="check-circle"
        :size="size"
      />
    </template>

    <template #more>
      <button
        v-if="
          Object.keys((category.category && category.category.filters) || [])
            .length > 0 && selected
        "
        type="button"
        class="tw-w-full tw-h-12 sm:tw-h-8 tw-text-left tw-rounded-lg tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100" :class="[
          isFiltered && 'tw-text-emerald-500',
          !isFiltered && 'tw-text-zinc-500',
        ]"
        @click="onFilterClick"
      >
        <FontAwesomeIcon icon="filter" size="sm" class="tw-ml-16" />
        {{
          isFiltered ? t('headerMenu.editFilters') : t('headerMenu.filter')
        }}
      </button>
    </template>
  </Item>
</template>

<style scoped>
button:not(.selected):hover svg[data-icon='check-circle'] {
  @apply tw-ring-zinc-100;
}

button.selected:hover svg[data-icon='check-circle'] {
  @apply tw-ring-white;
}
</style>
