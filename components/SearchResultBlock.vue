<template>
  <div class="mb-3">
    <h4 class="text-gray-500 text-sm mb-2">
      <font-awesome-icon v-if="icon" :icon="icon" />
      {{ label }}
    </h4>
    <ul>
      <li
        v-for="item in items"
        :key="item.id"
        class="mb-1 hover:bg-gray-100 cursor-pointer rounded-xl ml-2 px-2"
        :data-item="item.id"
        @click="() => onItemClick(item.id)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { SearchResult } from '@/utils/types'

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true,
    },
    items: {
      type: Array as PropType<SearchResult[]>,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
  },

  methods: {
    onItemClick(id: string) {
      this.$emit('item-click', id)
    },
  },
})
</script>
