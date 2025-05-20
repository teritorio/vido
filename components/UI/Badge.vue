<script setup lang="ts">
withDefaults(defineProps<{
  items: number
}>(), {
  items: 0,
})
</script>

<template>
  <span class="badge">
    {{ items }}
  </span>
</template>

<style lang="css" scoped>
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  border-radius: 9999px;
  min-width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #FFF;
  background-color: #DC2626;
  font-size: 0.75rem;
}
</style>
