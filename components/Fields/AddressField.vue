<script setup lang="ts">
import type { ApiPoiPropertiesAddress } from '~/types/api/poi'

const props = defineProps<ApiPoiPropertiesAddress>()

const { addressToString } = useField()

const address = computed(() => addressToString(props))
</script>

<template>
  <div>
    <slot />
    <span>
      {{ address }}
    </span>
  </div>
</template>
