<script lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'
import { defineNuxtComponent } from '#app'
import MenuItem from '~/components/Menu/Item.vue'
import type { ApiMenuCategory, ApiMenuItem } from '~/lib/apiMenu'
import type { FilterValues } from '~/utils/types-filters'
import { filterValuesIsSet } from '~/utils/types-filters'
import { getContrastedColors } from '~/composables/useFeature'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
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
      type: String as PropType<FontAwesomeIconProps['size']>,
      required: true,
    },
    displayModeDefault: {
      type: String as PropType<'compact' | 'large'>,
      required: true,
    },
  },
  computed: {
    isFiltered(): boolean {
      return this.filters && filterValuesIsSet(this.filters)
    },
    menuItemProps() {
      const { colorFill, colorText } = getContrastedColors(this.category.category.color_fill, this.category.category.color_text)

      return {
        id: `MenuItem-${this.category.id}`,
        href: `/${this.category.id}`,
        displayMode: this.category.category.display_mode || this.displayModeDefault,
        colorFill,
        colorText,
        icon: this.category.category.icon,
        size: this.size,
        name: this.category.category.name,
      }
    },
  },

  emits: {
    click: (_category_id: ApiMenuItem['id']) => true,
    filterClick: (_category_id: ApiMenuItem['id']) => true,
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
      this.$emit('filterClick', this.category.id)
    },
  },
})
</script>

<template>
  <MenuItem
    v-bind="menuItemProps"
    badge-class="tw-bg-white tw-text-zinc-700 tw-rounded-full tw-border-solid tw-border-2 tw-border-white"
    @click.prevent="onClick"
  >
    <template v-if="category.category.display_mode === 'compact'" #badge>
      <FontAwesomeIcon
        v-if="!selected"
        class="tw-text-zinc-300"
        :icon="['far', 'circle']"
        :size="size"
      />
      <FontAwesomeIcon
        v-else
        class="tw-text-emerald-500"
        icon="check-circle"
        :size="size"
      />
    </template>

    <template #end-line-large>
      <FontAwesomeIcon
        v-if="!selected"
        class="tw-text-zinc-300"
        :icon="['far', 'circle']"
        :size="size"
      />
      <FontAwesomeIcon
        v-else
        class="tw-text-emerald-500"
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
        class="tw-w-full tw-h-12 sm:tw-h-8 tw-text-left tw-rounded-lg tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100" :class="[
          isFiltered && 'tw-text-emerald-500',
          !isFiltered && 'tw-text-zinc-500',
        ]"
        @click="onFilterClick"
      >
        <FontAwesomeIcon icon="filter" size="sm" class="tw-ml-16" />
        {{
          isFiltered ? $t('headerMenu.editFilters') : $t('headerMenu.filter')
        }}
      </button>
    </template>
  </MenuItem>
</template>

<style scoped>
button:not(.selected):hover svg[data-icon='check-circle'] {
  @apply tw-ring-zinc-100;
}

button.selected:hover svg[data-icon='check-circle'] {
  @apply tw-ring-white;
}
</style>
