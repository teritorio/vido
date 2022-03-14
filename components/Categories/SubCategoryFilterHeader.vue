<template>
  <aside
    class="absolute inset-x-0 bottom-0 flex flex-col px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto sm:relative sm:inset-auto h-3/5 sm:h-auto sm:rounded-xl overflow-y-visible md:w-96"
  >
    <div class="flex justify-between">
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-gray-800" size="xs" />
      </button>
    </div>

    <template v-for="filter in filters">
      <div v-if="filter.type == 'boolean'" :key="filter.property">
        <label :key="filter.property" class="block mb-1 text-gray-800">
          <input
            type="checkbox"
            class="text-green-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="filter.property"
            :checked="filtersValues && filter.property in filtersValues"
            @change="
              (e) => onBooleanFilterChange(filter.property, e.target.checked)
            "
          />
          {{ (filter.name && filter.name.fr) || filter.property }}
        </label>
      </div>
      <div v-else-if="filter.type == 'multiselection'" :key="filter.property">
        <label :for="filter.property" class="block mb-2 text-gray-500">
          {{ (filter.name && filter.name.fr) || filter.property }}
        </label>
        <t-rich-select
          placeholder="Recherchez ou ajoutez une valeur"
          search-box-placeholder="Rechercher ..."
          text-attribute="name"
          value-attribute="code"
          multiple
          :options="
            filter.values.map((value) => ({
              name: (value.name && value.name.fr) || value.value,
              code: value.value,
            }))
          "
          :value="(filtersValues && filtersValues[filter.property]) || []"
          @input="(val) => onSelectionFilterChange(filter.property, val)"
        />
      </div>
      <div
        v-else-if="filter.type == 'checkboxes_list'"
        :key="filter.property"
        class="overflow-y-auto"
      >
        <p class="mb-2 text-gray-500">
          {{ (filter.name && filter.name.fr) || filter.property }}
        </p>
        <label
          v-for="value in filter.values"
          :key="value.value"
          class="block mb-1 text-gray-800"
        >
          <input
            type="checkbox"
            class="text-green-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="filter.property + '_' + value.value"
            :checked="
              (
                (filtersValues && filtersValues[filter.property]) ||
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
          value-attribute="label"
          :placeholder="filter.name && filter.name.fr"
          :hide-search-box="true"
          :options="dateFilters"
          :clearable="true"
          :value="
            filtersValues &&
            getDateFilter(
              filtersValues[String(filter.property_begin)],
              filtersValues[String(filter.property_end)]
            )
          "
          @input="(val) => onSelectionFilterDateChange(filter, val)"
        />
      </div>
    </template>
  </aside>
</template>

<script lang="ts">
import copy from 'fast-copy'
import Vue, { PropType } from 'vue'

import { Category, Filter, FilterDate } from '@/lib/apiMenu'
import { DateFilterLabel, DateFilterOption, FilterValues } from '@/utils/types'

export default Vue.extend({
  props: {
    subcategory: {
      type: Object as PropType<Category>,
      required: true,
    },
    filtersValues: {
      type: Object as PropType<FilterValues>,
      default: () => ({}),
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
          label: this.$tc('dateFilter.' + DateFilterLabel.TODAY),
          begin: today.toDateString(),
          end: tomorrow.toDateString(),
        },
        {
          label: this.$tc('dateFilter.' + DateFilterLabel.TOMORROW),
          begin: tomorrow.toDateString(),
          end: afterTomorrow.toDateString(),
        },
        {
          label: this.$tc('dateFilter.' + DateFilterLabel.THIS_WEEKEND),
          begin: saturday.toDateString(),
          end: monday.toDateString(),
        },
        {
          label: this.$tc('dateFilter.' + DateFilterLabel.NEXT_WEEK),
          begin: today.toDateString(),
          end: nextWeek.toDateString(),
        },
        {
          label: this.$tc('dateFilter.' + DateFilterLabel.NEXT_MONTH),
          begin: today.toDateString(),
          end: nextMonth.toDateString(),
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
      const newFilters: FilterValues = {
        values: this.filtersValues ? copy(this.filtersValues) : {},
      }

      if (value) {
        newFilters.values[property] = ['yes']
      } else if (newFilters.values[property]) {
        delete newFilters.values[property]
      }
      this.$emit('filter-changed', newFilters)
    },

    onSelectionFilterChange(property: string, values: string[] | null) {
      const newFilters: FilterValues = {
        values: this.filtersValues ? copy(this.filtersValues) : {},
      }

      if (values && values.length > 0) {
        newFilters.values[property] = values
      } else if (newFilters.values[property]) {
        delete newFilters.values[property]
      }
      this.$emit('filter-changed', newFilters)
    },

    onSelectionFilterDateChange(filter: FilterDate, value: string | null) {
      const newFilters: FilterValues = {
        values: this.filtersValues ? copy(this.filtersValues) : {},
      }

      if (value) {
        const dateRange = this.dateFilters.find(
          (e: DateFilterOption) => e.label === value
        )

        if (dateRange) {
          newFilters.dateRange = {
            propertyStart: filter.property_begin,
            propertyEnd: filter.property_end,
            value: [new Date(dateRange.begin), new Date(dateRange.end)],
          }
        }
      } else if (newFilters.dateRange) {
        delete newFilters.dateRange
        delete newFilters.dateRange
      }
      this.$emit('filter-changed', newFilters)
    },

    onCheckboxFilterChange(property: string, val: string, checked: boolean) {
      const newFilters: FilterValues = {
        values: this.filtersValues ? copy(this.filtersValues) : {},
      }

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

    getDateFilter(begin: string[], end: string[]) {
      const dateRange = this.dateFilters.find(
        (e: DateFilterOption) => e.begin === begin?.[0] && e.end === end?.[0]
      )
      return dateRange?.label
    },
  },
})
</script>
