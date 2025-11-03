<script setup lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MenuItem from '~/components/Menu/Item.vue'
import type { ApiMenuGroup, ApiMenuItem } from '~/lib/apiMenu'

const props = withDefaults(defineProps<{
  menuGroup: ApiMenuGroup
  categoriesActivesCount?: number
  size: FontAwesomeIconProps['size']
  displayModeDefault: 'compact' | 'large'
}>(), {
  categoriesActivesCount: 0,
})

const emit = defineEmits<{
  (e: 'click', menuGroupId: ApiMenuItem['id']): void
}>()

const { colorFill, colorText } = useContrastedColors(
  props.menuGroup.menu_group.color_fill,
  props.menuGroup.menu_group.color_text,
)

const menuItemProps = computed(() => {
  return {
    id: `MenuGroup-${props.menuGroup.id}`,
    href: `/${props.menuGroup.id}/`,
    displayMode: props.menuGroup.menu_group.display_mode || props.displayModeDefault,
    colorFill: colorFill.value,
    colorText: colorText.value,
    icon: props.menuGroup.menu_group.icon,
    size: props.size,
    name: props.menuGroup.menu_group.name,
    badgeClass: [
      'tw-bg-red-600 tw-text-white tw-rounded-full tw-border-2 tw-border-white',
      props.size === '2xl' ? 'tw-w-6 tw-h-6' : 'tw-w-5 tw-h-5',
    ].join(' '),
  }
})

const { $tracking } = useNuxtApp()

function onClick() {
  $tracking({
    type: 'menu',
    menuItemId: props.menuGroup.id,
    title: props.menuGroup.menu_group.name.fr,
  })

  emit('click', props.menuGroup.id)
}
</script>

<template>
  <MenuItem v-bind="menuItemProps" @click.prevent="onClick">
    <template v-if="categoriesActivesCount > 0" #badge>
      {{ categoriesActivesCount }}
    </template>
    <template #end-line-large>
      <FontAwesomeIcon icon="chevron-right" />
    </template>
  </MenuItem>
</template>
