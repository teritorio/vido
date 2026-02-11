<script setup lang="ts">
import type { PropertyTranslationsContextEnum } from '~/stores/site'
import { useSiteStore } from '~/stores/site'

defineProps<{
  value: string
  translationKey: string
  context: PropertyTranslationsContextEnum
}>()

const { pv } = useSiteStore()
</script>

<template>
  {{ pv(translationKey, value, context) }}
</template>
