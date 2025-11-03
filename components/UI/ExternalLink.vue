<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = withDefaults(defineProps<{
  href: string
  title?: string
  target?: string
  rel?: string
  icon?: string
}>(), {
  target: '_blank',
})

const iconDefault = computed((): string => {
  if (props.icon)
    return props.icon
  else if (props.href.startsWith('tel:'))
    return 'phone'
  else
    return 'external-link-alt'
})
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :rel="rel"
    :title="title"
    class="tw-flex tw-flex-row tw-items-center tw-gap-x-2.5 tw-underline tw-underline-offset-4"
  >
    <FontAwesomeIcon :icon="iconDefault" color="inherit" size="sm" />
    <slot />
  </a>
</template>
