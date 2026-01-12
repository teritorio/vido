<script setup lang="ts">
import type { PoiUnion } from '~/types/local/poi-deps'

const props = defineProps<{
  properties: PoiUnion['properties']
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
