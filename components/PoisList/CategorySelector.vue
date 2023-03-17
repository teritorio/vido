<template>
  <div>
    <v-autocomplete
      class="category-selector"
      solo
      :items="Object.values(menuEntries).map((a) => a[0])"
      :label="$t('categorySelector.placeholder')"
      @input="$emit('category-change', $event)"
    >
      <template #selection="{ props, item }">
        <v-list-item v-bind="props">
          <v-list-item-media>
            <TeritorioIcon
              :color-text="menuEntries[item.value][1].category.color_line"
              :picto="menuEntries[item.value][1].category.icon"
            />
          </v-list-item-media>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </template>
      <template #item="{ props, item }">
        <v-list-item v-bind="props">
          <v-list-item-media>
            <TeritorioIcon
              :color-text="menuEntries[item.value][1].category.color_line"
              :picto="menuEntries[item.value][1].category.icon"
            />
          </v-list-item-media>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
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
      [key: number]: [
        {
          value: number
          title: string
        },
        ApiMenuCategory
      ]
    } {
      const menuIndex: { [key: number]: MenuItem } = {}
      this.menuItems
        .filter((menuItem) => !menuItem.hidden)
        .forEach((menuItem) => {
          menuIndex[menuItem.id] = menuItem
        })

      const locales = useI18n().locales.value
      return Object.fromEntries(
        (
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

            return [
              {
                value: menuItem.id,
                title: [...parents.reverse(), menuItem.category.name.fr].join(
                  ' / '
                ),
              },
              menuItem,
            ]
          })
          .filter(
            (
              t
            ): t is NonNullable<
              [
                {
                  value: number
                  title: string
                },
                ApiMenuCategory
              ]
            > => t != null
          )
          .sort((a, b) =>
            a[0].title.localeCompare(
              b[0].title,
              locales.map((locale: string | LocaleObject) =>
                typeof locale === 'string' ? locale : locale.code
              )
            )
          )
          .map((a) => [a[0].value, a])
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
