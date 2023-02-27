<template>
  <t-rich-select
    class="category-selector"
    variant="default"
    :options="menuEntries"
    :value="categoryId"
    :placeholder="$t('categorySelector.placeholder')"
    :search-box-placeholder="$t('categorySelector.search')"
    @input="$emit('category-change', $event)"
  >
    <template #label="{ option }">
      <span class="block flex">
        <span class="flex-none w-6">
          <TeritorioIcon
            :color-text="option.raw.menuGroup.category.color_line"
            :picto="option.raw.menuGroup.category.icon"
          />
        </span>
        <span class="block flex flex-col">
          {{ option.raw.text }}
        </span>
      </span>
    </template>
    <template #option="{ option }">
      <div class="flex">
        <span class="flex-none w-6">
          <TeritorioIcon
            :color-text="option.raw.menuGroup.category.color_line"
            :picto="option.raw.menuGroup.category.icon"
          />
        </span>
        <div class="flex flex-col">
          {{ option.raw.text }}
        </div>
      </div>
    </template>
  </t-rich-select>
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
      type: Object as PropType<Record<ApiMenuCategory['id'], ApiMenuCategory>>,
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
      Object.values(this.menuItems || {})
        .filter((menuItem) => !menuItem.hidden)
        .forEach((menuItem) => {
          menuIndex[menuItem.id] = menuItem
        })

      return (
        Object.values(this.menuItems || {}).filter(
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
