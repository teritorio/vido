<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps<{
  url: string
}>()
</script>

<template>
  <a v-if="url" :href="url" target="_blank">
    <FontAwesomeIcon icon="fa-brands fa-instagram" size="lg" />
  </a>
</template>
