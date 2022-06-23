<template>
  <font-awesome-icon
    :icon="[`${isActive ? 'fas' : 'far'}`, 'star']"
    :class="[
      !isActive && !colorLine && 'text-amber-500',
      isActive && 'text-amber-500',
    ]"
    :color="!isActive && colorLine"
    size="sm"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    colorLine: {
      type: String,
      default: null,
    },
    colorClass: {
      type: String,
      default: 'text-white',
    },
  },
})
</script>
