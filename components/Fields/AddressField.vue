<script setup lang="ts">
import type { ApiPoiProperties } from '~/lib/apiPois'

const props = defineProps<{
  properties: ApiPoiProperties
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
