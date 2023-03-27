<template>
  <MenuItem
    :id="`MenuLink-${menuLink.id}`"
    :href="menuLink.link.href"
    :display-mode="menuLink.link.display_mode || displayModeDefault"
    :color-fill="menuLink.link.color_fill"
    :icon="menuLink.link.icon"
    :size="size"
    :name="menuLink.link.name"
    :badge-class="
      [
        'tw-bg-white tw-text-zinc-700 tw-rounded-full tw-border-2 tw-border-white',
        size === '2xl' ? 'tw-w-6 tw-h-6' : 'tw-w-5 tw-h-5',
      ].join(' ')
    "
    @click="onClick"
  >
    <template v-if="menuLink.link.display_mode === 'compact'" #badge>
      <FontAwesomeIcon icon="external-link-alt" size="sm" />
    </template>
    <template #end-line-large>
      <FontAwesomeIcon icon="external-link-alt" />
    </template>
  </MenuItem>
</template>

<script lang="ts">
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/vue-fontawesome'
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import MenuItem from '~/components/Menu/Item.vue'
import { ApiMenuItem, ApiMenuLink } from '~/lib/apiMenu'

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

  emits: {
    click: (menuLinkId: ApiMenuItem['id']) => true,
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
