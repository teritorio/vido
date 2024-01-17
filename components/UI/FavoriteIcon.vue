<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    colorLine: {
      type: String as PropType<string>,
      default: null,
    },
    colorClass: {
      type: String as PropType<string>,
      default: 'text-white',
    },
  },
})
</script>

<template>
  <FontAwesomeIcon
    :icon="[isActive ? 'fas' : 'far', 'star']"
    :class="[
      !isActive && !colorLine && 'tw-text-amber-500',
      isActive && 'tw-text-amber-500',
    ]"
    :color="!isActive && colorLine"
    size="sm"
  />
</template>
