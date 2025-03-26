<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { VAutocomplete } from 'vuetify/components/VAutocomplete'
import { VListItem, VListItemMedia } from 'vuetify/components/VList'
import { localeIncludes } from 'locale-includes'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import type { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'

const props = withDefaults(defineProps<{
  filters?: number[]
  menuItems: Record<number, MenuItem>
  categoryId?: number
  label?: string
}>(), {
  label: 'categorySelector.placeholderSelect',
})

const emit = defineEmits<{
  (e: 'categoryChange', categoryId: number): void
}>()

const { locale, locales, t } = useI18n()
const { contribMode } = useContrib()

const menuEntries = computed((): Array<{ value: number, title: string, category: ApiMenuCategory['category'] } | undefined> => {
  const localeCompareOptions = locales.value.map(locale => typeof locale === 'string' ? locale : locale.code)

  return Object.values(props.menuItems)
    .filter(menuItem => contribMode ? menuItem.category : menuItem.category && !menuItem.hidden)
    .map((menuItem) => {
      const parents: string[] = []
      let parentId = menuItem.parent_id
      let isIncluded = false

      while (parentId) {
        if (!props.menuItems[parentId])
          return undefined

        if (props.filters && (props.filters.includes(parentId) || props.filters.includes(menuItem.id)))
          isIncluded = true

        const name = props.menuItems[parentId].menu_group?.name.fr

        if (name && props.menuItems[parentId].parent_id)
          parents.unshift(name)

        parentId = props.menuItems[parentId].parent_id
      }

      if (props.filters && !isIncluded)
        return undefined

      return {
        value: menuItem.id,
        title: [...parents, (menuItem as ApiMenuCategory).category.name.fr].join(' / '),
        category: (menuItem as ApiMenuCategory).category,
      }
    })
    .filter(t => t !== undefined)
    .sort((a, b) => a && b ? a.title.localeCompare(b.title, localeCompareOptions) : -1)
})

function customFilter(item: string, query: string) {
  return localeIncludes(item, query, { locales: locale.value, sensitivity: 'base' })
}
</script>

<template>
  <div>
    <VAutocomplete
      :model-value="categoryId"
      :items="menuEntries"
      :label="t(label)"
      :menu-props="{ maxWidth: '100%' }"
      :custom-filter="customFilter"
      class="category-selector"
      solo
      variant="solo"
      rounded
      hide-details="auto"
      @update:model-value="emit('categoryChange', $event)"
    >
      <template #prepend-inner>
        <div class="tw-right-0 tw-px-5 tw-text-zinc-800">
          <FontAwesomeIcon icon="search" />
        </div>
      </template>
      <template #item="{ props: scopedProps, item }">
        <VListItem v-bind="scopedProps" :title="undefined">
          <VListItemMedia>
            <TeritorioIcon
              :color-text="item.raw!.category.color_line"
              :picto="item.raw!.category.icon"
              use-native-alignment
            />
            {{ item.title }}
          </VListItemMedia>
        </VListItem>
      </template>
    </VAutocomplete>
  </div>
</template>

<style scoped>
.category-selector input[type='text'] {
  padding: 0 6px;
  outline: none !important;
}

.v-list-item-media {
  direction: rtl;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
