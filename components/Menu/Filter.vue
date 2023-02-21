<template>
  <div class="basis-max shrink flex flex-col gap-4 flex-1">
    <template v-for="(filter, filterIndex) in filtersSafeCopy">
      <div v-if="filter.type == 'boolean'" :key="filter.def.property">
        <label :key="filter.def.property" class="block mb-1 text-zinc-800">
          <input
            type="checkbox"
            class="text-emerald-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="filter.def.property"
            :checked="filter.filterValue"
            @change="onBooleanFilterChange(filterIndex, $event)"
          />
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
        </label>
      </div>
      <div
        v-else-if="filter.type == 'multiselection'"
        :key="filter.def.property"
      >
        <label :for="filter.def.property" class="block mb-2 text-zinc-500">
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
        </label>
        <SelectFilter
          :filter="filter"
          @change="onSelectionFilterChange(filterIndex, $event)"
          @click="onClickFilter(true)"
          @blur="onClickFilter(false)"
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
                  //@ts-ignore
                  e.target.checked
                )
            "
          />
          {{ (value.name && value.name.fr) || value.value }}
        </label>
      </div>
      <div
        v-else-if="filter.type == 'date_range'"
        :key="filter.def.property_begin"
      >
        <DateRange
          :filter="filter"
          @change="onSelectionFilterDateChange(filterIndex, $event)"
        />
      </div>
      <div v-else-if="filter.type == 'number_range'" :key="filter.def.property">
        <label class="block mb-1 text-zinc-800">
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
          <NumberRange
            :filter="filter"
            @change="onSelectionFilterNumberRangeChange(filterIndex, $event)"
          />
        </label>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import copy from 'fast-copy'
import { mapActions } from 'pinia'
import { defineComponent, PropType } from 'vue'

import DateRange from '~/components/Filters/DateRange.vue'
import NumberRange from '~/components/Filters/NumberRange.vue'
import SelectFilter from '~/components/Filters/Select.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import { menuStore } from '~/stores/menu'
import {
  FilterValueBoolean,
  FilterValueDate,
  FilterValueList,
  FilterValueNumberRange,
  FilterValues,
} from '~/utils/types-filters'

export default defineComponent({
  components: {
    SelectFilter,
    DateRange,
    NumberRange,
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
    ...mapActions(menuStore, ['applyFilters']),

    onGoBackClick() {
      this.$emit('go-back-click')
    },

    onClickFilter(val: boolean) {
      this.$emit('activate-filter', val)
    },

    onBooleanFilterChange(filterIndex: number, e: Event) {
      // @ts-ignore
      const value: boolean = e.target.checked

      const filters = this.filtersSafeCopy
      const filter = filters[filterIndex] as FilterValueBoolean

      filter.filterValue = value
      this.applyFilters({
        categoryId: this.categoryId,
        filterValues: filters,
      })
    },

    onSelectionFilterChange(filterIndex: number, values: string[] | null) {
      const filters = this.filtersSafeCopy
      const filter = filters[filterIndex] as FilterValueList

      filter.filterValues = values || []
      this.applyFilters({
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

      this.applyFilters({
        categoryId: this.categoryId,
        filterValues: filters,
      })
    },

    onSelectionFilterNumberRangeChange(
      filterIndex: number,
      filterValue: FilterValueNumberRange
    ) {
      const filters = this.filtersSafeCopy
      filters[filterIndex] = filterValue

      this.applyFilters({
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

      this.applyFilters({
        categoryId: this.categoryId,
        filterValues: filters,
      })
    },
  },
})
</script>
