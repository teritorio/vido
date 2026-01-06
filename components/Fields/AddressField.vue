<script setup lang="ts">
import type { Poi } from '~/types/local/poi'

const props = defineProps<{
  properties: Poi['properties']
}>()

const address = computed(() => {
  const { addressToString } = useField()

  return addressToString(props.properties)
})
</script>

<template>
  <div>
    <slot />
    <span>
      {{ address }}
    </span>
  </div>
</template>
