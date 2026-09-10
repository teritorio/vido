<script setup lang="ts">
withDefaults(defineProps<{
  extraClassTextBackground?: string
}>(), {
  extraClassTextBackground: 'tw-bg-white',
})
</script>

<template>
  <aside class="tw-rounded-xl tw-pointer-events-auto tw-overflow-y-hidden">
    <div class="tw-px-5 tw-py-4 tw-rounded-xl tw-shadow-md" :class="[extraClassTextBackground]">
      <slot />
    </div>
  </aside>
</template>

<style lang="css" scoped>
aside {
  min-width: 432px;
}

aside > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
