<template>
  <div class="flex flex-col items-start">
    <button
      class="flex items-center justify-between w-full px-5 py-3 rounded-lg outline-none focus:outline-none hover:bg-gray-100"
      @click="onClick"
    >
      <div class="flex items-center space-x-4">
        <TeritorioIconBadge
          :color="category.color"
          :picto="category.picto"
          size="lg"
        />

        <div class="text-left">{{ category.label }}</div>
      </div>

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
    </button>
    <button
      v-if="category.filtres.length > 0 && selected"
      :class="[
        'w-full text-left rounded-lg outline-none focus:outline-none hover:bg-gray-100',
        filtered && 'text-green-500',
        !filtered && 'text-gray-500',
      ]"
      @click="onFilterClick"
    >
      <font-awesome-icon icon="filter" size="sm" class="ml-16" />
      {{ filtered ? 'Modifier les filtres' : 'Filtrer' }}
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
  },
  methods: {
    onClick() {
      this.$emit('click', this.category.id)
    },
    onFilterClick() {
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
