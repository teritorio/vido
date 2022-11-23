<template>
  <div class="basis-max shrink flex flex-col gap-4 overflow-y-auto flex-1">
    <template v-for="(filter, filterIndex) in filtersSafeCopy">
      <div v-if="filter.type == 'boolean'" :key="filter.property">
        <label :key="filter.def.property" class="block mb-1 text-zinc-800">
          <input
            type="checkbox"
            class="text-emerald-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="filter.def.property"
            :checked="filter.filterValue"
            @change="
              (e) => onBooleanFilterChange(filterIndex, e.target.checked)
            "
          />
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
        </label>
      </div>
      <div v-else-if="filter.type == 'multiselection'" :key="filter.property">
        <label :for="filter.property" class="block mb-2 text-zinc-500">
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
        </label>
        <t-rich-select
          placeholder="Recherchez ou ajoutez une valeur"
          search-box-placeholder="Rechercher ..."
          multiple
          :options="
            filter.def.values.map((value) => ({
              text: (value.name && value.name.fr) || value.value,
              value: value.value,
            }))
          "
          :value="filter.filterValues"
          @input="(val) => onSelectionFilterChange(filterIndex, val)"
        />
      </div>
      <div
        v-else-if="filter.type == 'checkboxes_list'"
        :key="filter.def.property"
      >
        <p class="mb-2 text-zinc-500">
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
        </p>
        <label
          v-for="value in filter.def.values"
          :key="value.value"
          class="block mb-1 text-zinc-800"
        >
          <input
            type="checkbox"
            class="text-emerald-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="filter.def.property + '_' + value.value"
            :checked="filter.filterValues.includes(value.value)"
            @change="
              (e) =>
                onCheckboxFilterChange(
                  filterIndex,
                  value.value,
                  e.target.checked
                )
            "
          />
          {{ (value.name && value.name.fr) || value.value }}
        </label>
      </div>
      <div v-else-if="filter.type == 'date_range'" :key="filter.property_begin">
        <DateRange
          :filter="filter"
          @change="
            (filterValue) =>
              onSelectionFilterDateChange(filterIndex, filterValue)
          "
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import copy from 'fast-copy'
import Vue, { PropType } from 'vue'
import { mapActions } from 'vuex'

import DateRange from '~/components/Filters/DateRange.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import {
  FilterValueBoolean,
  FilterValueDate,
  FilterValueList,
  FilterValues,
} from '~/utils/types-filters'

export default Vue.extend({
  components: {
    DateRange,
  },

  props: {
    categoryId: {
      type: Number as PropType<ApiMenuCategory['id']>,
      required: true,
    },
    filtersValues: {
      type: Array as PropType<FilterValues>,
      required: true,
    },
  },

  computed: {
    filtersSafeCopy() {
      return copy(this.filtersValues)
    },
  },

  methods: {
    ...mapActions({
      applyCategorieFilters: 'menu/applyFilters',
    }),

    onGoBackClick() {
      this.$emit('go-back-click')
    },

    onBooleanFilterChange(filterIndex: number, value: boolean) {
      const filters = this.filtersSafeCopy
      const filter = filters[filterIndex] as FilterValueBoolean

      filter.filterValue = value
      this.applyCategorieFilters({
        categoryId: this.categoryId,
        filterValues: filters,
      })
    },

    onSelectionFilterChange(filterIndex: number, values: string[] | null) {
      const filters = this.filtersSafeCopy
      const filter = filters[filterIndex] as FilterValueList

      filter.filterValues = values || []
      this.applyCategorieFilters({
        categoryId: this.categoryId,
        filterValues: filters,
      })
    },

    onSelectionFilterDateChange(
      filterIndex: number,
      filterValue: FilterValueDate
    ) {
      const filters = this.filtersSafeCopy
      filters[filterIndex] = filterValue

      this.applyCategorieFilters({
        categoryId: this.categoryId,
        filterValues: filters,
      })
    },

    onCheckboxFilterChange(filterIndex: number, val: string, checked: boolean) {
      const filters = this.filtersSafeCopy
      const filter = filters[filterIndex] as FilterValueList

      if (checked && !filter.filterValues.includes(val)) {
        filter.filterValues.push(val)
      } else if (!checked) {
        filter.filterValues = filter.filterValues.filter((k) => k !== val)
      }

      this.applyCategorieFilters({
        categoryId: this.categoryId,
        filterValues: filters,
      })
    },
  },
})
</script>
