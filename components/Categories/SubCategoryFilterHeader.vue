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

    <template v-for="filter in filters">
      <div v-if="filter.type == 'boolean'" :key="filter.property">
        <label :key="filter.property" class="block mb-1 text-zinc-800">
          <input
            type="checkbox"
            class="text-emerald-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="filter.property"
            :checked="filtersValues && filter.property in filtersValues.values"
            @change="
              (e) => onBooleanFilterChange(filter.property, e.target.checked)
            "
          />
          {{ (filter.name && filter.name.fr) || filter.property }}
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
            filter.values.map((value) => ({
              text: (value.name && value.name.fr) || value.value,
              value: value.value,
            }))
          "
          :value="
            (filtersValues && filtersValues.values[filter.property]) || []
          "
          @input="(val) => onSelectionFilterChange(filter.property, val)"
        />
      </div>
      <div
        v-else-if="filter.type == 'checkboxes_list'"
        :key="filter.property"
        class="overflow-y-auto"
      >
        <p class="mb-2 text-zinc-500">
          {{ (filter.name && filter.name.fr) || filter.property }}
        </p>
        <label
          v-for="value in filter.values"
          :key="value.value"
          class="block mb-1 text-zinc-800"
        >
          <input
            type="checkbox"
            class="text-emerald-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="filter.property + '_' + value.value"
            :checked="
              (
                (filtersValues && filtersValues.values[filter.property]) ||
                []
              ).includes(value.value)
            "
            @change="
              (e) =>
                onCheckboxFilterChange(
                  filter.property,
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
          :placeholder="filter.name && filter.name.fr"
          :hide-search-box="true"
          :options="dateFilters"
          :clearable="true"
          :value="getDateFilter()"
          @input="(val) => onSelectionFilterDateChange(filter, val)"
        />
      </div>
    </template>
  </aside>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { Category, Filter, FilterDate } from '@/lib/apiMenu'
import { FilterValues } from '@/utils/types'

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
      type: Object as PropType<FilterValues>,
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
    filters(): Filter[] {
      return this.subcategory.category?.filters || []
    },
  },

  methods: {
    onGoBackClick() {
      this.$emit('go-back-click')
    },

    onBooleanFilterChange(property: string, value: boolean) {
      const newFilters: FilterValues = this.filtersValues
        ? { values: this.filtersValues.values }
        : { values: {} }

      if (value) {
        newFilters.values[property] = ['yes']
        this.$emit('filter-changed', newFilters)
      } else if (newFilters.values[property]) {
        delete newFilters.values[property]
        this.$emit('filter-changed', newFilters)
      }
    },

    onSelectionFilterChange(property: string, values: string[] | null) {
      const newFilters: FilterValues = this.filtersValues
        ? { values: this.filtersValues.values }
        : { values: {} }

      if (values && values.length > 0) {
        newFilters.values[property] = values
        this.$emit('filter-changed', newFilters)
      } else if (newFilters.values[property]) {
        delete newFilters.values[property]
        this.$emit('filter-changed', newFilters)
      }
    },

    onSelectionFilterDateChange(filter: FilterDate, value: string | null) {
      const newFilters: FilterValues = this.filtersValues
        ? { values: this.filtersValues.values }
        : { values: {} }

      if (value) {
        const dateRange = this.dateFilters.find(
          (e: DateFilterOption) => e.value === value
        )

        if (dateRange) {
          newFilters.dateRange = {
            propertyStart: filter.property_begin,
            propertyEnd: filter.property_end,
            value: [dateRange.begin, dateRange.end],
          }
        }
      } else if (newFilters.dateRange) {
        delete newFilters.dateRange
      }
      this.$emit('filter-changed', newFilters)
    },

    onCheckboxFilterChange(property: string, val: string, checked: boolean) {
      const newFilters: FilterValues = this.filtersValues
        ? { values: this.filtersValues.values }
        : { values: {} }

      if (!newFilters.values[property]) {
        newFilters.values[property] = []
      }

      const filterValue = newFilters.values[property] as string[]

      if (checked) {
        if (!filterValue.includes(val)) {
          filterValue.push(val)
        }
      } else if (newFilters.values[property].includes(val)) {
        newFilters.values[property] = filterValue.filter(
          (k: string) => k !== val
        )
      }

      if (newFilters.values[property].length === 0) {
        delete newFilters.values[property]
      }
      this.$emit('filter-changed', newFilters)
    },

    getDateFilter() {
      if (this.filtersValues.dateRange) {
        const dateRange = this.dateFilters.find(
          (e) =>
            e.begin === this.filtersValues.dateRange?.value[0] &&
            e.end === this.filtersValues.dateRange?.value[1]
        )
        return dateRange?.value
      }
    },
  },
})
</script>
