<script setup lang="ts">
import type { ApiPoiPropertiesAddress } from '~/types/api/poi'
import { AddressFields } from '~/types/api/poi'

const props = defineProps<ApiPoiPropertiesAddress>()

const address = computed(() => {
  return AddressFields
    .map(field => props[field])
    .map(f => (f || '').toString().trim())
    .filter(f => f)
    .join(' ')
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
