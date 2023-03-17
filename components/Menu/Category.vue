<template>
  <MenuItem
    :id="`MenuItem-${category.id}`"
    :href="`/${category.id}`"
    :display-mode="category.category.display_mode || displayModeDefault"
    :color-fill="category.category.color_fill"
    :icon="category.category.icon"
    :size="size"
    :name="category.category.name"
    badge-class="tw-bg-white tw-text-zinc-700 tw-rounded-full tw-border-solid tw-border-2 tw-border-white"
    @click.prevent="onClick"
  >
    <template v-if="category.category.display_mode === 'compact'" #badge>
      <font-awesome-icon
        v-if="!selected"
        class="tw-text-zinc-300"
        :icon="['far', 'circle']"
        :size="size"
      />
      <font-awesome-icon
        v-else
        class="tw-text-emerald-500"
        icon="check-circle"
        :size="size"
      />
    </template>

    <template #end-line-large>
      <font-awesome-icon
        v-if="!selected"
        class="tw-text-zinc-300"
        :icon="['far', 'circle']"
        :size="size"
      />
      <font-awesome-icon
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
        :class="[
          'tw-w-full tw-h-12 sm:tw-h-8 tw-text-left tw-rounded-lg tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100',
          isFiltered && 'text-emerald-500',
          !isFiltered && 'text-zinc-500',
        ]"
        @click="onFilterClick"
      >
        <font-awesome-icon icon="filter" size="sm" class="tw-ml-16" />
        {{
          isFiltered ? $t('headerMenu.editFilters') : $t('headerMenu.filter')
        }}
      </button>
    </template>
  </MenuItem>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent, useNuxtApp } from '#app'
import MenuItem from '~/components/Menu/Item.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import { FilterValues, filterValuesIsSet } from '~/utils/types-filters'

export default defineNuxtComponent({
  components: {
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
      type: String as PropType<string>,
      required: true,
    },
    displayModeDefault: {
      type: String as PropType<string>,
      required: true,
    },
  },
  computed: {
    isFiltered(): boolean {
      return this.filters && filterValuesIsSet(this.filters)
    },
  },
  methods: {
    onClick() {
      const { $tracking } = useNuxtApp()
      $tracking({
        type: 'category_event',
        event: 'enable',
        categoryId: this.category.id,
        title: this.category.category.name.fr,
      })

      this.$emit('click', this.category.id)
    },
    onFilterClick() {
      const { $tracking } = useNuxtApp()
      $tracking({
        type: 'category_event',
        event: 'filter',
        categoryId: this.category.id,
        title: this.category.category.name.fr,
      })
      this.$emit('filter-click', this.category.id)
    },
  },
})
</script>

<style scoped>
button:not(.selected):hover svg[data-icon='check-circle'] {
  @apply tw-ring-zinc-100;
}

button.selected:hover svg[data-icon='check-circle'] {
  @apply tw-ring-white;
}
</style>
