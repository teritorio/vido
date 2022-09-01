<template>
  <MenuItem
    :id="menuGroup.id"
    :href="`/${menuGroup.id}/`"
    :display-mode="menuGroup.menu_group.display_mode"
    :color-fill="menuGroup.menu_group.color_fill"
    :icon="menuGroup.menu_group.icon"
    :size="size"
    :name="menuGroup.menu_group.name"
    badge-class="bg-red-600"
    @click.prevent="onClick"
  >
    <template v-if="categoriesActivesCount > 0" #badge>
      <span class="text-white">
        {{ categoriesActivesCount }}
      </span>
    </template>
    <template #end-line-large>
      <font-awesome-icon icon="chevron-right" />
    </template>
  </MenuItem>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import MenuItem from '~/components/Menu/Item.vue'
import { ApiMenuGroup } from '~/lib/apiMenu'

export default Vue.extend({
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
      type: String,
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
