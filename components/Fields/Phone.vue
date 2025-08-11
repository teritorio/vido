<script setup lang="ts">
import ExternalLink from '~/components/UI/ExternalLink.vue'
import useDevice from '~/composables/useDevice'

const props = defineProps<{
  number: string
}>()

const device = useDevice()

const numberFormated = computed((): string => {
  return props.number.replaceAll(' ', ' ')
})
</script>

<template>
  <ExternalLink
    v-if="device.phone"
    :href="`tel:${number}`"
    :title="$t('fields.phone.callNumber')"
  >
    {{ numberFormated }}
  </ExternalLink>
  <span v-else>
    {{ numberFormated }}
  </span>
</template>
