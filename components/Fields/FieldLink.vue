<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { PropertyTranslationsContextEnum } from '~/stores/site'
import type { TextColors } from '~/types/api/poi'

const props = withDefaults(defineProps<{
  href: string
  title?: string
  target?: string
  rel?: string
  icon?: string
  context: PropertyTranslationsContextEnum
  colorFill?: string
  colorText?: TextColors
}>(), {
  target: '_blank',
})

const iconDefault = computed((): string => {
  if (props.icon)
    return props.icon
  else if (props.href.startsWith('tel:'))
    return 'phone'
  else if (props.href.startsWith('mailto:'))
    return 'envelope'
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
    :style="{
      backgroundColor: ['label_popup', 'label_list'].includes(context) ? colorFill : 'unset',
      color: ['label_popup', 'label_list'].includes(context) ? colorText : 'unset',
    }"
    :class="{
      'tw-flex tw-flex-row tw-items-center tw-gap-x-2.5 tw-underline tw-underline-offset-4': !['label_popup', 'label_list'].includes(context),
      'tw-inline-flex tw-items-center tw-justify-center tw-gap-1 pa-2 rounded-lg': ['label_popup', 'label_list'].includes(context),
    }"
  >
    <FontAwesomeIcon
      :icon="iconDefault"
      color="inherit"
      size="sm"
    />
    <slot v-if="context !== PropertyTranslationsContextEnum.List" />
  </a>
</template>
