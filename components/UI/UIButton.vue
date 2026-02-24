<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

withDefaults(defineProps<{
  color?: string
  label?: string
  icon?: string
}>(), {
  color: '#000000',
})
</script>

<template>
  <button
    type="button"
    class="tw-flex tw-gap-1 tw-items-center tw-border-solid tw-border-zinc-300 tw-border-2 tw-bg-white focus:tw-outline-none focus-visible:tw-bg-zinc-100 tw-py-2 tw-px-4 tw-rounded-full"
    v-bind="$attrs"
  >
    <FontAwesomeIcon
      v-if="icon"
      ref="menu_icon"
      :icon="icon"
      class="tw-text-zinc-500"
      size="sm"
    />
    <span v-if="label" class="tw-hidden sm:tw-block">{{ label }}</span>
  </button>
</template>

<style scoped>
svg {
  color: v-bind(color)
}
</style>
