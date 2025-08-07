<script lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'
import { defineNuxtComponent } from '#app'
import MenuItem from '~/components/Menu/Item.vue'
import type { ApiMenuItem, ApiMenuLink } from '~/lib/apiMenu'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    MenuItem,
  },
  props: {
    menuLink: {
      type: Object as PropType<ApiMenuLink>,
      required: true,
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

  setup(props) {
    const { colorFill, colorText } = useContrastedColors(
      props.menuLink.link.color_fill,
      props.menuLink.link.color_text,
    )

    return { colorFill, colorText }
  },

  emits: {
    click: (_menuLinkId: ApiMenuItem['id']) => true,
  },

  computed: {
    menuItemProps() {
      return {
        id: `MenuLink-${this.menuLink.id}`,
        href: this.menuLink.link.href,
        displayMode: this.menuLink.link.display_mode || this.displayModeDefault,
        colorFill: this.colorFill,
        colorText: this.colorText,
        icon: this.menuLink.link.icon,
        size: this.size,
        name: this.menuLink.link.name,
        badgeClass: [
          'tw-bg-white tw-text-zinc-700 tw-rounded-full tw-border-2 tw-border-white',
          this.size === '2xl' ? 'tw-w-6 tw-h-6' : 'tw-w-5 tw-h-5',
        ].join(' '),
      }
    },
  },

  methods: {
    onClick() {
      this.$tracking({
        type: 'external_link',
        url: this.menuLink.link.href,
        title: this.menuLink.link.name.fr,
      })

      this.$emit('click', this.menuLink.id)
    },
  },
})
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
