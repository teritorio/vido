<script setup lang="ts">
withDefaults(defineProps<{
  extraClass?: string
}>(), {
  extraClass: '',
})
</script>

<template>
  <div :class="extraClass">
    <slot />
  </div>
</template>
