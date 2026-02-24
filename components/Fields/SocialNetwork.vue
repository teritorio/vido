<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps<{
  url: string
  icon?: string
}>()

const iconSlug = computed(() => {
  return `fa-${props.icon}` || 'fa-share'
})
</script>

<template>
  <a v-if="url" :href="url" target="_blank">
    <FontAwesomeIcon :icon="`fa-brands ${iconSlug}`" size="lg" />
  </a>
</template>
