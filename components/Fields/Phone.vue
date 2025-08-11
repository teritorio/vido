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
    class="phone"
    :href="`tel:${number}`"
    :title="$t('fields.phone.callNumber')"
  >
    {{ numberFormated }}
  </ExternalLink>
  <span v-else class="phone">
    {{ numberFormated }}
  </span>
</template>

<style lang="css" scoped>
.phone {
  word-break: break-word;
}
</style>
