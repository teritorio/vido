<template>
  <div class="flex flex-col items-start">
    <button
      :is="href ? 'a' : 'button'"
      :href="href"
      target="_blank"
      class="flex items-center justify-between w-full px-5 py-3 rounded-lg outline-none focus:outline-none hover:bg-zinc-100"
      @click="onClick"
    >
      <div class="flex items-center space-x-4">
        <div class="relative">
          <TeritorioIconBadge
            :color-fill="
              (category.menu_group || category.link || category.category)
                .color_fill
            "
            :picto="
              (category.menu_group || category.link || category.category).icon
            "
            size="lg"
          />

          <div
            v-if="activeSubCategories > 0"
            class="text-white text-xs font-semibold font-sans text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600"
          >
            {{ activeSubCategories }}
          </div>
        </div>

        <div class="text-left">{{ category.label }}</div>
      </div>

      <template v-if="href">
        <font-awesome-icon
          class="text-zinc-700"
          fixed-width
          icon="external-link-alt"
          size="sm"
        />
      </template>
      <template v-else-if="hasChildren">
        <font-awesome-icon
          class="text-zinc-800"
          fixed-width
          icon="chevron-right"
          size="lg"
        />
      </template>
      <template v-else>
        <div v-if="!selected" class="shrink-0 text-zinc-300">
          <font-awesome-icon
            class="fill-current"
            fixed-width
            :icon="['far', 'circle']"
            size="lg"
          />
        </div>

        <div v-if="selected" class="shrink-0 text-emerald-500">
          <font-awesome-icon
            class="fill-current"
            fixed-width
            icon="check-circle"
            size="lg"
          />
        </div>
      </template>
    </button>
    <button
      v-if="
        Object.keys((category.category && category.category.filters) || [])
          .length > 0 && selected
      "
      :class="[
        'w-full h-12 sm:h-8 text-left rounded-lg outline-none focus:outline-none hover:bg-zinc-100',
        isFiltered && 'text-emerald-500',
        !isFiltered && 'text-zinc-500',
      ]"
      @click="onFilterClick"
    >
      <font-awesome-icon icon="filter" size="sm" class="ml-16" />
      {{
        isFiltered ? $tc('headerMenu.editFilters') : $tc('headerMenu.filter')
      }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { Category } from '~/lib/apiMenu'
import { FilterValues, filterValuesIsSet } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    TeritorioIconBadge,
  },
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    filters: {
      type: Array as unknown as PropType<FilterValues>,
      default: null,
    },
    activeSubCategories: {
      type: Number,
      default: 0,
    },
    href: {
      type: String,
      default: null,
    },
  },
  computed: {
    hasChildren(): boolean {
      return (this.category?.menu_group?.vido_children || []).length > 0
    },
    isFiltered(): boolean {
      return this.filters && filterValuesIsSet(this.filters)
    },
  },
  methods: {
    onClick() {
      if (this.href) {
        this.$tracking({
          type: 'external_link',
          url: this.href,
          title: (
            this.category.menu_group ||
            this.category.link ||
            this.category.category
          ).name.fr,
        })
      } else if (this.hasChildren) {
        this.$tracking({
          type: 'category',
          categoryId: this.category.id,
          title: (
            this.category.menu_group ||
            this.category.link ||
            this.category.category
          ).name.fr,
        })
      } else {
        this.$tracking({
          type: 'category_event',
          event: 'enable',
          categoryId: this.category.id,
          title: (
            this.category.menu_group ||
            this.category.link ||
            this.category.category
          ).name.fr,
        })
      }

      this.$emit('click', this.category.id)
    },
    onFilterClick() {
      this.$tracking({
        type: 'category_event',
        event: 'filter',
        categoryId: this.category.id,
        title: (
          this.category.menu_group ||
          this.category.link ||
          this.category.category
        ).name.fr,
      })
      this.$emit('filter-click', this.category.id)
    },
  },
})
</script>

<style scoped>
button:not(.selected):hover svg[data-icon='check-circle'] {
  @apply ring-zinc-100;
}

button.selected:hover svg[data-icon='check-circle'] {
  @apply ring-white;
}
</style>
