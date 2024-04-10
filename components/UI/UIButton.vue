<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

  props: {
    label: {
      type: String as PropType<string>,
      default: undefined,
    },
    icon: {
      type: String as PropType<string>,
      default: undefined,
    },
  },
})
</script>

<template>
  <button
    type="button"
    class="tw-flex tw-items-center tw-border-solid tw-border-zinc-300 tw-border-2 tw-bg-white focus:tw-outline-none focus-visible:tw-bg-zinc-100 hover:tw-bg-zinc-100 tw-py-2 tw-px-4 tw-rounded-full"
    v-bind="$attrs"
  >
    <FontAwesomeIcon
      v-if="icon"
      ref="menu_icon"
      :icon="icon"
      class="tw-text-zinc-500" :class="[label && 'md:tw-mr-2']"
      size="sm"
    />
    <span v-if="label" class="tw-hidden sm:tw-block">{{ label }}</span>
  </button>
</template>
