<template>
  <button
    :class="[
      'flex focus:outline-none outline-none items-center self-stretch justify-start pt-4 pb-2 leading-none transition-colors rounded-lg p-4',
      !selected && 'hover:bg-gray-100',
      selected && 'selected bg-gray-100 hover:bg-transparent',
      type === 'compact' && 'flex-col',
      type === 'large' && 'col-span-3 sm:col-span-4',
    ]"
    @click="onClick"
  >
    <div
      class="relative flex items-center justify-center w-12 h-12 mb-2 text-white rounded-full"
      :style="{ backgroundColor: color, flexShrink: 0 }"
    >
      <TeritorioIcon :category-color="color" class="text-2xl" :picto="picto" />

      <div
        v-if="activeSubCategories > 0"
        class="text-white text-xs font-semibold font-sans text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600"
      >
        {{ activeSubCategories }}
      </div>

      <div
        v-if="selected"
        class="absolute -right-0.5 text-lg text-green-500 -top-1.5"
      >
        <font-awesome-icon
          icon="check-circle"
          :class="[
            'rounded-full bg-white fill-current ring-2 transition-colors',
            !selected && 'ring-white',
            selected && 'ring-gray-100',
          ]"
        />
      </div>
    </div>

    <div
      :class="[
        'text-xs',
        type === 'large' && 'mx-4 grow text-sm w-full text-left',
      ]"
    >
      {{ label }}
    </div>
    <font-awesome-icon
      v-if="type === 'large'"
      icon="chevron-right"
      class="text-gray-700 shrink-0"
      size="sm"
    />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'

export default Vue.extend({
  components: {
    TeritorioIcon,
  },
  props: {
    color: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    picto: {
      type: String,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    activeSubCategories: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
    },
  },
  methods: {
    onClick() {
      this.$emit('click', this.$props.id)
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
