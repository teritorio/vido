<script lang="ts">
import type {
  FontAwesomeIconProps,
} from '@fortawesome/vue-fontawesome'
import {
  FontAwesomeIcon,
} from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import MenuItem from '~/components/Menu/Item.vue'
import type { ApiMenuCategory, ApiMenuItem } from '~/lib/apiMenu'
import type { FilterValues } from '~/utils/types-filters'
import { filterValuesIsSet } from '~/utils/types-filters'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    MenuItem,
  },
  props: {
    category: {
      type: Object as PropType<ApiMenuCategory>,
      required: true,
    },
    filters: {
      type: Array as unknown as PropType<FilterValues>,
      default: null,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    size: {
      type: String as PropType<FontAwesomeIconProps['size']>,
      required: true,
    },
    displayModeDefault: {
      type: String as PropType<'compact' | 'large'>,
      required: true,
    },
  },
  computed: {
    isFiltered(): boolean {
      return this.filters && filterValuesIsSet(this.filters)
    },
    categoryUrl(): string {
      const id = this.category.id.toString()
      // Get current categories from the route
      const currentCategories = this.$route.params.p1?.toString().split(',') ?? []

      // Check if the category is already selected
      const categoryIndex = currentCategories.indexOf(id)

      if (categoryIndex === -1) {
      // Add the category if it doesn't exist
        currentCategories.push(id)
      }
      else {
      // Remove the category if it exists
        currentCategories.splice(categoryIndex, 1)
      }

      // Generate the new route
      return currentCategories.length ? `/${currentCategories.join(',')}/` : '/'
    },
  },

  emits: {
    click: (_category_id: ApiMenuItem['id']) => true,
    filterClick: (_category_id: ApiMenuItem['id']) => true,
  },

  methods: {
    onClick() {
      this.$tracking({
        type: 'category_event',
        event: 'enable',
        categoryId: this.category.id,
        title: this.category.category.name.fr,
      })
    },
    onFilterClick() {
      this.$tracking({
        type: 'category_event',
        event: 'filter',
        categoryId: this.category.id,
        title: this.category.category.name.fr,
      })
      this.$emit('filterClick', this.category.id)
    },
  },
})
</script>

<template>
  <MenuItem
    :id="`MenuItem-${category.id}`"
    :href="categoryUrl"
    :display-mode="category.category.display_mode || displayModeDefault"
    :color-fill="category.category.color_fill"
    :icon="category.category.icon"
    :size="size"
    :name="category.category.name"
    badge-class="tw-bg-white tw-text-zinc-700 tw-rounded-full tw-border-solid tw-border-2 tw-border-white"
    @click="onClick"
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
          isFiltered ? $t('headerMenu.editFilters') : $t('headerMenu.filter')
        }}
      </button>
    </template>
  </MenuItem>
</template>

<style scoped>
button:not(.selected):hover svg[data-icon='check-circle'] {
  @apply tw-ring-zinc-100;
}

button.selected:hover svg[data-icon='check-circle'] {
  @apply tw-ring-white;
}
</style>
