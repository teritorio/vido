<template>
  <div>
    <v-autocomplete
      :model-value="categoryId"
      class="category-selector"
      solo
      :items="menuEntries"
      :label="$t(label)"
      variant="solo"
      rounded
      hide-details="auto"
      @update:model-value="$emit('category-change', $event)"
    >
      <template #prepend-inner>
        <div class="tw-right-0 tw-px-5 tw-text-zinc-800">
          <FontAwesomeIcon icon="search" />
        </div>
      </template>
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="null">
          <v-list-item-media>
            <TeritorioIcon
              :color-text="item.raw.category.color_line"
              :picto="item.raw.category.icon"
              use-native-alignment
            />
            {{ item.title }}
          </v-list-item-media>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { PropType } from 'vue'
import { LocaleObject } from 'vue-i18n-routing'
import { VAutocomplete } from 'vuetify/components/VAutocomplete'
import {
  VListItem,
  VListItemMedia,
  VListItemTitle,
} from 'vuetify/components/VList'

import { defineNuxtComponent } from '#app'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'

export default defineNuxtComponent({
  components: {
    VAutocomplete,
    VListItem,
    VListItemMedia,
    VListItemTitle,
    TeritorioIcon,
    FontAwesomeIcon,
  },

  emits: {
    'category-change': (_categoryId: number) => true,
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
    label: {
      type: String,
      default: 'categorySelector.placeholderSelect',
    },
  },

  computed: {
    menuEntries(): [
      {
        value: number
        title: string
        category: ApiMenuCategory['category']
      }
    ] {
      const menuIndex: { [key: number]: MenuItem } = {}
      this.menuItems
        .filter((menuItem) => menuItem.menu_group)
        .forEach((menuItem) => {
          menuIndex[menuItem.id] = menuItem
        })

      const locales = this.$i18n.locales
      const localeCompareOptions = locales.map(
        (locale: string | LocaleObject) =>
          typeof locale === 'string' ? locale : locale.code
      )
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
            title: [...parents.reverse(), menuItem.category.name.fr].join(
              ' / '
            ),
            category: menuItem.category,
          }
        })
        .filter((t) => t != null)
        .sort((a, b) => a.title.localeCompare(b.title, localeCompareOptions))
    },
  },
})
</script>

<style>
.category-selector input[type='text'] {
  padding: 0 6px;
  outline: none !important;
}
</style>
