<script lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'
import { defineNuxtComponent } from '#app'
import MenuItem from '~/components/Menu/Item.vue'
import type { ApiMenuGroup, ApiMenuItem } from '~/lib/apiMenu'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    MenuItem,
  },
  props: {
    menuGroup: {
      type: Object as PropType<ApiMenuGroup>,
      required: true,
    },
    categoriesActivesCount: {
      type: Number,
      default: 0,
    },
    size: {
      type: String as PropType<FontAwesomeIconProps['size']>,
      required: true,
    },
    displayModeDefault: {
      type: String as PropType<'compact' | 'large'>,
      required: true,
    },
  },

  emits: {
    click: (_menuGroupId: ApiMenuItem['id']) => true,
  },

  setup(props) {
    const { colorFill, colorText } = useContrastedColors(
      props.menuGroup.menu_group.color_fill,
      props.menuGroup.menu_group.color_text,
    )

    return { colorFill, colorText }
  },

  computed: {
    menuItemProps() {
      return {
        id: `MenuGroup-${this.menuGroup.id}`,
        href: `/${this.menuGroup.id}/`,
        displayMode: this.menuGroup.menu_group.display_mode || this.displayModeDefault,
        colorFill: this.colorFill,
        colorText: this.colorText,
        icon: this.menuGroup.menu_group.icon,
        size: this.size,
        name: this.menuGroup.menu_group.name,
        badgeClass: [
          'tw-bg-red-600 tw-text-white tw-rounded-full tw-border-2 tw-border-white',
          this.size === '2xl' ? 'tw-w-6 tw-h-6' : 'tw-w-5 tw-h-5',
        ].join(' '),
      }
    },
  },

  methods: {
    onClick() {
      this.$tracking({
        type: 'menu',
        menuItemId: this.menuGroup.id,
        title: this.menuGroup.menu_group.name.fr,
      })

      this.$emit('click', this.menuGroup.id)
    },
  },
})
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
