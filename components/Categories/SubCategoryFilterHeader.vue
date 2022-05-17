<template>
  <aside
    class="absolute inset-x-0 bottom-0 flex flex-col px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto sm:relative sm:inset-auto h-3/5 sm:h-auto sm:rounded-xl overflow-y-visible md:w-96"
  >
    <div class="flex justify-between">
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-zinc-800" size="xs" />
      </button>
    </div>

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
          {{ (filter.name && filter.name.fr) || filter.property }}
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
        class="overflow-y-auto"
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
        <t-rich-select
          :placeholder="filter.def.name && filter.def.name.fr"
          :hide-search-box="true"
          :options="dateFilters"
          :clearable="true"
          :value="getDateFilter(filter)"
          @input="(val) => onSelectionFilterDateChange(filterIndex, val)"
        />
      </div>
    </template>
  </aside>
</template>

<script lang="ts">
import copy from 'fast-copy'
import Vue, { PropType } from 'vue'
import { mapActions } from 'vuex'

import { Category } from '@/lib/apiMenu'
import {
  FilterValueBoolean,
  FilterValueDate,
  FilterValueList,
  FilterValues,
} from '@/utils/types-filters'

export enum DateFilterLabel {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEKEND = 'thisWeekend',
  NEXT_WEEK = 'nextWeek',
  NEXT_MONTH = 'nextMonth',
}

export type DateFilterOption = {
  text: string
  value: string
  begin: string
  end: string
}

export default Vue.extend({
  props: {
    subcategory: {
      type: Object as PropType<Category>,
      required: true,
    },
    filtersValues: {
      type: Array as PropType<FilterValues>,
      required: true,
    },
  },

  data(): {
    dateFilters: DateFilterOption[]
  } {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const afterTomorrow = new Date(tomorrow)
    afterTomorrow.setDate(afterTomorrow.getDate() + 1)

    const saturday = new Date()
    saturday.setDate(saturday.getDate() + (7 - (saturday.getDay() % 5 || 6)))

    const monday = new Date()
    monday.setDate(monday.getDate() + (7 - (monday.getDay() % 7 || 7)))

    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    return {
      dateFilters: [
        {
          text: this.$tc('dateFilter.' + DateFilterLabel.TODAY),
          value: DateFilterLabel.TODAY,
          begin: today.toISOString().substring(0, 10),
          end: tomorrow.toISOString().substring(0, 10),
        },
        {
          text: this.$tc('dateFilter.' + DateFilterLabel.TOMORROW),
          value: DateFilterLabel.TOMORROW,
          begin: tomorrow.toISOString().substring(0, 10),
          end: afterTomorrow.toISOString().substring(0, 10),
        },
        {
          text: this.$tc('dateFilter.' + DateFilterLabel.THIS_WEEKEND),
          value: DateFilterLabel.THIS_WEEKEND,
          begin: saturday.toISOString().substring(0, 10),
          end: monday.toISOString().substring(0, 10),
        },
        {
          text: this.$tc('dateFilter.' + DateFilterLabel.NEXT_WEEK),
          value: DateFilterLabel.NEXT_WEEK,
          begin: today.toISOString().substring(0, 10),
          end: nextWeek.toISOString().substring(0, 10),
        },
        {
          text: this.$tc('dateFilter.' + DateFilterLabel.NEXT_MONTH),
          value: DateFilterLabel.NEXT_MONTH,
          begin: today.toISOString().substring(0, 10),
          end: nextMonth.toISOString().substring(0, 10),
        },
      ],
    }
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
        categoryId: this.subcategory.id,
        filterValues: filters,
      })
    },

    onSelectionFilterChange(filterIndex: number, values: string[] | null) {
      const filters = this.filtersSafeCopy
      const filter = filters[filterIndex] as FilterValueList

      filter.filterValues = values || []
      this.applyCategorieFilters({
        categoryId: this.subcategory.id,
        filterValues: filters,
      })
    },

    onSelectionFilterDateChange(filterIndex: number, value: string | null) {
      const filters = this.filtersSafeCopy
      const filter = filters[filterIndex] as FilterValueDate

      if (value) {
        const dateRange = this.dateFilters.find(
          (e: DateFilterOption) => e.value === value
        )

        if (dateRange) {
          filter.filterValueBegin = dateRange.begin
          filter.filterValueEnd = dateRange.end
        }
      } else {
        filter.filterValueBegin = null
        filter.filterValueEnd = null
      }

      this.applyCategorieFilters({
        categoryId: this.subcategory.id,
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
        categoryId: this.subcategory.id,
        filterValues: filters,
      })
    },

    getDateFilter(filter: FilterValueDate) {
      return this.dateFilters.find(
        (e) =>
          e.begin === filter.filterValueBegin && e.end === filter.filterValueEnd
      )?.value
    },
  },
})
</script>
