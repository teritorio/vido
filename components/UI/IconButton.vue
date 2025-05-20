<script setup lang="ts">
defineProps<{
  label: string
  href?: string
  target?: string
}>()
</script>

<template>
  <button
    v-if="!href"
    :aria-label="label"
    type="button"
    class="icon-button"
  >
    <slot />
  </button>
  <NuxtLink
    v-else-if="!href.startsWith('http://') && !href.startsWith('https://')"
    :aria-label="label"
    :to="href"
    :target="target"
    class="icon-button"
  >
    <slot />
  </NuxtLink>
  <a
    v-else
    :aria-label="label"
    :href="href"
    :target="target"
    class="icon-button"
  >
    <slot />
  </a>
</template>

<style lang="css" scoped>
.icon-button {
  font-size: 0.875rem;
  color: #27272A;
  background-color: #FFF;
  border-radius: 9999px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 10%), 0 1px 3px rgb(0 0 0 / 10%);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.625rem;
  padding-right: 0.625rem;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.icon-button:hover,
.icon-button:focus-visible {
  background-color: #F4F4F5;
}

.icon-button:focus {
  outline: none;
}
</style>
