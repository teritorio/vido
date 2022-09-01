<template>
  <div class="flex flex-col items-start">
    <button
      :id="`Category-${category.id}`"
      class="flex items-center justify-between w-full px-5 py-3 rounded-lg outline-none focus:outline-none hover:bg-zinc-100"
      @click="onClick"
    >
      <div class="flex items-center space-x-4">
        <div class="relative">
          <TeritorioIconBadge
            :color-fill="category.category.color_fill"
            :picto="category.category.icon"
            :size="size"
          />

          <div
            v-if="activeSubCategories > 0"
            class="text-white text-xs font-semibold font-sans text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600"
          >
            {{ activeSubCategories }}
          </div>
        </div>

        <div class="text-left">{{ category.category.name.fr }}</div>
      </div>

      <div v-if="!selected" class="shrink-0 text-zinc-300">
        <font-awesome-icon
          class="fill-current"
          fixed-width
          :icon="['far', 'circle']"
          :size="size"
        />
      </div>
      <div v-else class="shrink-0 text-emerald-500">
        <font-awesome-icon
          class="fill-current"
          fixed-width
          icon="check-circle"
          :size="size"
        />
      </div>
    </button>
    <button
      v-if="
        Object.keys((category.category && category.category.filters) || [])
          .length > 0 && selected
      "
      :class="[
        'w-full h-12 sm:h-8 text-left rounded-lg outline-none focus:outline-none hover:bg-zinc-100',
        isFiltered && 'text-emerald-500',
        !isFiltered && 'text-zinc-500',
      ]"
      @click="onFilterClick"
    >
      <font-awesome-icon icon="filter" size="sm" class="ml-16" />
      {{
        isFiltered ? $tc('headerMenu.editFilters') : $tc('headerMenu.filter')
      }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import { FilterValues, filterValuesIsSet } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    TeritorioIconBadge,
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
      type: String,
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
      this.$tracking({
        type: 'category_event',
        event: 'enable',
        categoryId: this.category.id,
        title: this.category.category.name.fr,
      })

      this.$emit('click', this.category.id)
    },
    onFilterClick() {
      this.$tracking({
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
  @apply ring-zinc-100;
}

button.selected:hover svg[data-icon='check-circle'] {
  @apply ring-white;
}
</style>
