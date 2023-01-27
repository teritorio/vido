<template>
  <MenuItem
    :id="`MenuItem-${category.id}`"
    :href="`/${category.id}`"
    :display-mode="category.category.display_mode || displayModeDefault"
    :color-fill="category.category.color_fill"
    :icon="category.category.icon"
    :size="size"
    :name="category.category.name"
    badge-class="bg-white text-zinc-700 rounded-full border-2 border-white"
    @click.prevent="onClick"
  >
    <template v-if="category.category.display_mode === 'compact'" #badge>
      <font-awesome-icon
        v-if="!selected"
        class="text-zinc-300"
        :icon="['far', 'circle']"
        :size="size"
      />
      <font-awesome-icon
        v-else
        class="text-emerald-500"
        icon="check-circle"
        :size="size"
      />
    </template>

    <template #end-line-large>
      <font-awesome-icon
        v-if="!selected"
        class="text-zinc-300"
        :icon="['far', 'circle']"
        :size="size"
      />
      <font-awesome-icon
        v-else
        class="text-emerald-500"
        icon="check-circle"
        :size="size"
      />
    </template>

    <template #more>
      <button
        v-if="
          Object.keys((category.category && category.category.filters) || [])
            .length > 0 && selected
        "
        type="button"
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
    </template>
  </MenuItem>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import MenuItem from '~/components/Menu/Item.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import { FilterValues, filterValuesIsSet } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    MenuItem,
  },
  props: {
    category: {
      type: Object as PropType<ApiMenuCategory>,
      required: true,
    },
    filters: {
      type: Array as unknown as PropType<FilterValues>,
      default: null,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    displayModeDefault: {
      type: String,
      required: true,
    },
  },
  computed: {
    isFiltered(): boolean {
      return this.filters && filterValuesIsSet(this.filters)
    },
  },
  methods: {
    onClick() {
      this.$tracking({
        type: 'category_event',
        event: 'enable',
        categoryId: this.category.id,
        title: this.category.category.name.fr,
      })

      this.$emit('click', this.category.id)
    },
    onFilterClick() {
      this.$tracking({
        type: 'category_event',
        event: 'filter',
        categoryId: this.category.id,
        title: this.category.category.name.fr,
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
