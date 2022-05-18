<template>
  <button
    :is="href ? 'a' : 'button'"
    :href="href"
    target="black_"
    :class="[
      'flex focus:outline-none outline-none items-center self-stretch justify-start leading-none transition-colors rounded-lg p-4 relative hover:bg-zinc-100',
      type === 'large' ? 'col-span-4 pt-2 pb-0' : 'pt-4 pb-2 flex-col',
    ]"
    @click="!href && onClick()"
  >
    <div
      class="relative flex items-center justify-center w-12 h-12 mb-2 text-white rounded-full"
      :style="{ backgroundColor: colorFill, flexShrink: 0 }"
    >
      <TeritorioIcon
        :color-background="colorFill"
        class="text-2xl"
        :picto="picto"
      />

      <div
        v-if="activeSubCategories > 0"
        class="text-white text-xs font-semibold font-sans text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600"
      >
        {{ activeSubCategories }}
      </div>
    </div>

    <div
      :class="[
        'text-xs',
        type === 'large' && 'sm:text-sm mx-4 text-left',
        type === 'large' && !href && 'grow w-full',
      ]"
    >
      {{ label }}
    </div>
    <font-awesome-icon
      v-if="type === 'large' && !href"
      icon="chevron-right"
      class="text-zinc-700 shrink-0"
      size="sm"
    />
    <font-awesome-icon
      v-else-if="href"
      icon="external-link-alt"
      :class="[
        'text-zinc-700',
        type === 'compact' &&
          'absolute top-4 right-4 z-10 rounded-md bg-white fill-current ring-2 border-2 border-white ring-white',
      ]"
      size="sm"
    />
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'

import { ApiMenuGroup } from '~/lib/apiMenu'

export default Vue.extend({
  components: {
    TeritorioIcon,
  },
  props: {
    colorFill: {
      type: String,
      required: true,
    },
    categoryId: {
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
    activeSubCategories: {
      type: Number,
      default: 0,
    },
    type: {
      type: String as PropType<ApiMenuGroup['menu_group']['display_mode']>,
      required: true,
    },
    href: {
      type: String,
      default: null,
    },
  },
  methods: {
    onClick() {
      this.$emit('click', this.$props.categoryId)
    },
  },
})
</script>
