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
        'bg-red-600 text-white rounded-full border-2 border-white',
        size === '2xl' ? 'w-6 h-6' : 'w-5 h-5',
      ].join(' ')
    "
    @click.prevent="onClick"
  >
    <template v-if="categoriesActivesCount > 0" #badge>
      {{ categoriesActivesCount }}
    </template>
    <template #end-line-large>
      <font-awesome-icon icon="chevron-right" />
    </template>
  </MenuItem>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import MenuItem from '~/components/Menu/Item.vue'
import { ApiMenuGroup } from '~/lib/apiMenu'

export default defineComponent({
  components: {
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
      type: String as PropType<string>,
      required: true,
    },
    displayModeDefault: {
      type: String as PropType<string>,
      required: true,
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
