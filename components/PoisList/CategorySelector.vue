<template>
  <div data-app>
    <v-autocomplete
      class="category-selector"
      solo
      :items="menuEntries"
      :placeholder="$t('categorySelector.placeholder')"
      @input="$emit('category-change', $event)"
    >
      <template #item="data">
        <v-list-item-content>
          <v-list-item-title>
            <div class="flex">
              <span class="flex-none w-6">
                <TeritorioIcon
                  :color-text="data.item.menuGroup.category.color_line"
                  :picto="data.item.menuGroup.category.icon"
                />
              </span>
              <div class="flex flex-col">
                {{ data.item.text }}
              </div>
            </div>
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import { LocaleObject } from '@nuxtjs/i18n'
import Vue, { PropType } from 'vue'

import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'

export default Vue.extend({
  components: {
    TeritorioIcon,
  },

  props: {
    menuItems: {
      type: Array as PropType<ApiMenuCategory[]>,
      required: true,
    },
    categoryId: {
      type: Number,
      default: undefined,
    },
  },

  computed: {
    menuEntries(): {
      value: number
      text: string
      menuGroup: ApiMenuCategory
    }[] {
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
            menuGroup: menuItem,
          }
        })
        .filter(
          (
            t
          ): t is NonNullable<{
            value: number
            text: string
            menuGroup: ApiMenuCategory
          }> => t != null
        )
        .sort((a, b) =>
          a.text.localeCompare(
            b.text,
            this.$i18n.locales.map((locale: string | LocaleObject) =>
              typeof locale === 'string' ? locale : locale.code
            )
          )
        )
    },
  },
})
</script>

<style scoped>
:deep(.v-text-field__details) {
  display: none;
}

:deep(.v-input__slot) {
  margin: 0;
}
</style>
