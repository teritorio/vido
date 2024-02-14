<script setup lang="ts">
import ExternalLink from '~/components/UI/ExternalLink.vue'

defineProps<{ urls: string[] }>()
</script>

<template>
  <div
    v-for="(url, index) in urls"
    :key="index"
  >
    <ExternalLink :href="url">
      {{ url }}
    </ExternalLink>
  </div>
</template>
