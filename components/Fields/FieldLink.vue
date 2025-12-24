<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { PropertyTranslationsContextEnum } from '~/stores/site'
import type { TextColors } from '~/lib/apiPois'

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

const { colorFill, colorText } = useContrastedColors(
  toRef(() => props.colorFill || '#FFFFFF'),
  toRef(() => props.colorText),
)

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
    :style="{
      backgroundColor: props.context === 'label_popup' ? colorFill : 'unset',
      color: props.context === 'label_popup' ? colorText : 'unset',
    }"
    :class="{
      'tw-flex tw-flex-row tw-items-center tw-gap-x-2.5 tw-underline tw-underline-offset-4': context !== PropertyTranslationsContextEnum.Card,
      'd-inline-block pa-2 rounded-lg': context === PropertyTranslationsContextEnum.Card,
    }"
  >
    <FontAwesomeIcon :icon="iconDefault" color="inherit" size="sm" />
    <slot v-if="context !== PropertyTranslationsContextEnum.List" />
  </a>
</template>
