<script setup lang="ts">
withDefaults(defineProps<{
  recursionStack?: string[]
}>(), {
  recursionStack: () => [],
})

const { t } = useI18n()
</script>

<template>
  <h2 v-if="recursionStack && recursionStack.length === 0">
    <slot />
  </h2>
  <h3 v-else-if="recursionStack && recursionStack.length === 1">
    <slot />
  </h3>
  <span v-else><slot />{{ t('ponctuation.colon') }}</span>
</template>
