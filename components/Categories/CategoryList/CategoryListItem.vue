<template>
  <div class="flex flex-col items-start">
    <button
      class="flex items-center justify-between w-full px-5 py-3 rounded-lg outline-none focus:outline-none hover:bg-gray-100"
      @click="onClick"
    >
      <div class="flex items-center space-x-4">
        <div class="relative">
          <TeritorioIconBadge
            :color="(category.menu_group || category.category).color"
            :picto="(category.menu_group || category.category).icon"
            size="lg"
          />

          <div
            v-if="activeSubCategories > 0"
            class="text-white text-xs font-semibold font-sans text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600"
          >
            {{ activeSubCategories }}
          </div>
        </div>

        <div class="text-left">{{ category.label }}</div>
      </div>

      <template v-if="hasChildren">
        <font-awesome-icon
          class="text-gray-800"
          fixed-width
          icon="chevron-right"
          size="lg"
        />
      </template>
      <template v-else>
        <div v-if="!selected" class="flex-shrink-0 text-gray-300">
          <font-awesome-icon
            class="fill-current"
            fixed-width
            :icon="['far', 'circle']"
            size="lg"
          />
        </div>

        <div v-if="selected" class="flex-shrink-0 text-green-500">
          <font-awesome-icon
            class="fill-current"
            fixed-width
            icon="check-circle"
            size="lg"
          />
        </div>
      </template>
    </button>
    <button
      v-if="
        Object.keys((category.category && category.category.filters) || [])
          .length > 0 && selected
      "
      :class="[
        'w-full h-12 sm:h-8 text-left rounded-lg outline-none focus:outline-none hover:bg-gray-100',
        filtered && 'text-green-500',
        !filtered && 'text-gray-500',
      ]"
      @click="onFilterClick"
    >
      <font-awesome-icon icon="filter" size="sm" class="ml-16" />
      {{ filtered ? $tc('headerMenu.editFilters') : $tc('headerMenu.filter') }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '@/components/TeritorioIcon/TeritorioIconBadge.vue'
import { Category } from '@/utils/types'

export default Vue.extend({
  components: {
    TeritorioIconBadge,
  },
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    filtered: {
      type: Boolean,
      default: false,
    },
    activeSubCategories: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    hasChildren(): boolean {
      return (this.category.vido_children || []).length > 0
    },
  },
  methods: {
    onClick() {
      this.$tracking({
        type: 'category_event',
        event: 'enable',
        categoryId: this.category.id,
        title: (this.category.menu_group || this.category.category).name.fr,
      })
      this.$emit('click', this.category.id)
    },
    onFilterClick() {
      this.$tracking({
        type: 'category_event',
        event: 'filter',
        categoryId: this.category.id,
        title: (this.category.menu_group || this.category.category).name.fr,
      })
      this.$emit('filter-click', this.category.id)
    },
  },
})
</script>

<style scoped>
button:not(.selected):hover svg[data-icon='check-circle'] {
  @apply ring-gray-100;
}

button.selected:hover svg[data-icon='check-circle'] {
  @apply ring-white;
}
</style>
