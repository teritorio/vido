<template>
  <t-rich-select
    :options="menuEntries"
    :value="categoryId"
    @input="$emit('category-change', $event)"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'

export default Vue.extend({
  props: {
    menuItems: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
    categoryId: {
      type: Number,
      required: true,
    },
  },

  computed: {
    menuEntries(): { value: number; text: string }[] {
      const menuIndex: { [key: number]: MenuItem } = {}
      this.menuItems
        .filter((menuItem) => !menuItem.hidden)
        .forEach((menuItem) => {
          menuIndex[menuItem.id] = menuItem
        })

      return (
        this.menuItems.filter(
          (menuItem) => menuItem.category && !menuItem.hidden
        ) as ApiMenuCategory[]
      )
        .map((menuItem) => {
          let parents: string[] = []
          let parentId = menuItem.parent_id
          while (parentId) {
            if (!menuIndex[parentId]) {
              return undefined
            }
            const name = menuIndex[parentId].menu_group?.name.fr
            if (name && menuIndex[parentId].parent_id) {
              parents.push(name)
            }
            parentId = menuIndex[parentId].parent_id
          }

          return {
            value: menuItem.id,
            text: [...parents.reverse(), menuItem.category.name.fr].join(' / '),
          }
        })
        .filter((a) => a !== undefined) as { value: number; text: string }[]
    },
  },
})
</script>
