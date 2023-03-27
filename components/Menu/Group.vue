<template>
  <MenuItem
    :id="`MenuGroup-${menuGroup.id}`"
    :href="`/${menuGroup.id}/`"
    :display-mode="menuGroup.menu_group.display_mode || displayModeDefault"
    :color-fill="menuGroup.menu_group.color_fill"
    :icon="menuGroup.menu_group.icon"
    :size="size"
    :name="menuGroup.menu_group.name"
    :badge-class="
      [
        'tw-bg-red-600 tw-text-white tw-rounded-full tw-border-2 tw-border-white',
        size === '2xl' ? 'tw-w-6 tw-h-6' : 'tw-w-5 tw-h-5',
      ].join(' ')
    "
    @click.prevent="onClick"
  >
    <template v-if="categoriesActivesCount > 0" #badge>
      {{ categoriesActivesCount }}
    </template>
    <template #end-line-large>
      <FontAwesomeIcon icon="chevron-right" />
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
import { ApiMenuGroup, ApiMenuItem } from '~/lib/apiMenu'

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
    click: (menuGroupId: ApiMenuItem['id']) => true,
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
