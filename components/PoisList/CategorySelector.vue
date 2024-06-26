<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'
import type { LocaleObject } from 'vue-i18n-routing'
import { VAutocomplete } from 'vuetify/components/VAutocomplete'
import {
  VListItem,
  VListItemMedia,
  VListItemTitle,
} from 'vuetify/components/VList'

import { localeIncludes } from 'locale-includes'
import { defineNuxtComponent } from '#app'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import type { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'

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
    categoryChange: (_categoryId: number) => true,
  },

  props: {
    filters: {
      type: Array as PropType<number[]>,
    },
    menuItems: {
      type: Object as PropType<Record<number, MenuItem>>,
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

  setup() {
    const { locale } = useI18n()

    return {
      locale,
    }
  },

  computed: {
    menuEntries(): Array<{ value: number, title: string, category: ApiMenuCategory['category'] } | undefined> {
      const { contribMode } = useContrib()
      const locales = this.$i18n.locales
      const localeCompareOptions = locales.map(
        (locale: string | LocaleObject) =>
          typeof locale === 'string' ? locale : locale.code,
      )

      return Object.values(this.menuItems).filter(
        menuItem => contribMode ? menuItem.category : menuItem.category && !menuItem.hidden,
      )
        .map((menuItem) => {
          const parents: string[] = []
          let parentId = menuItem.parent_id
          let isIncluded = false

          while (parentId) {
            if (!this.menuItems[parentId])
              return undefined

            if (this.filters && (this.filters.includes(parentId) || this.filters.includes(menuItem.id)))
              isIncluded = true

            const name = this.menuItems[parentId].menu_group?.name.fr
            if (name && this.menuItems[parentId].parent_id)
              parents.unshift(name)

            parentId = this.menuItems[parentId].parent_id
          }

          if (this.filters && !isIncluded)
            return undefined

          return {
            value: menuItem.id,
            title: [...parents, (menuItem as ApiMenuCategory).category.name.fr].join(
              ' / ',
            ),
            category: (menuItem as ApiMenuCategory).category,
          }
        })
        .filter(t => t !== undefined)
        .sort((a, b) => a && b ? a.title.localeCompare(b.title, localeCompareOptions) : -1)
    },
  },

  methods: {
    customFilter(item: string, query: string) {
      return localeIncludes(item, query, { locales: this.locale, sensitivity: 'base' })
    },
  },
})
</script>

<template>
  <div>
    <v-autocomplete
      :model-value="categoryId"
      class="category-selector"
      solo
      :items="menuEntries"
      :label="$t(label)"
      :menu-props="{ maxWidth: '100%' }"
      variant="solo"
      rounded
      hide-details="auto"
      :custom-filter="customFilter"
      @update:model-value="$emit('categoryChange', $event)"
    >
      <template #prepend-inner>
        <div class="tw-right-0 tw-px-5 tw-text-zinc-800">
          <FontAwesomeIcon icon="search" />
        </div>
      </template>
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="undefined">
          <v-list-item-media>
            <TeritorioIcon
              :color-text="item.raw!.category.color_line"
              :picto="item.raw!.category.icon"
              use-native-alignment
            />
            {{ item.title }}
          </v-list-item-media>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<style scoped>
.category-selector input[type='text'] {
  padding: 0 6px;
  outline: none !important;
}

.v-list-item-media {
  direction: rtl;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
