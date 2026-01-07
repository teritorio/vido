<script setup lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MenuItem from '~/components/Menu/Item.vue'
import type { ApiMenuItem, ApiMenuLink } from '~/types/api/menu'

const props = defineProps<{
  menuLink: ApiMenuLink
  size: FontAwesomeIconProps['size']
  displayModeDefault: 'compact' | 'large'
}>()

const emit = defineEmits<{
  (e: 'click', menuLinkId: ApiMenuItem['id']): void
}>()

const { colorFill, colorText } = useContrastedColors(props.menuLink.link.color_fill)

const menuItemProps = computed(() => {
  return {
    id: `MenuLink-${props.menuLink.id}`,
    href: props.menuLink.link.href,
    displayMode: props.menuLink.link.display_mode || props.displayModeDefault,
    colorFill: colorFill.value,
    colorText: colorText.value,
    icon: props.menuLink.link.icon,
    size: props.size,
    name: props.menuLink.link.name,
    badgeClass: [
      'tw-bg-white tw-text-zinc-700 tw-rounded-full tw-border-2 tw-border-white',
      props.size === '2xl' ? 'tw-w-6 tw-h-6' : 'tw-w-5 tw-h-5',
    ].join(' '),
  }
})

const { $tracking } = useNuxtApp()
function onClick() {
  $tracking({
    type: 'external_link',
    url: props.menuLink.link.href,
    title: props.menuLink.link.name.fr || '',
  })

  emit('click', props.menuLink.id)
}
</script>

<template>
  <MenuItem v-bind="menuItemProps" @click="onClick">
    <template v-if="menuLink.link.display_mode === 'compact'" #badge>
      <FontAwesomeIcon icon="external-link-alt" size="sm" />
    </template>
    <template #end-line-large>
      <FontAwesomeIcon icon="external-link-alt" />
    </template>
  </MenuItem>
</template>
