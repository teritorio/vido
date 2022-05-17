<template>
  <t-rich-select
    :placeholder="filter.def.name && filter.def.name.fr"
    :hide-search-box="true"
    :options="dateFilters"
    :clearable="true"
    :value="currentValue()"
    @input="onChange"
  />
</template>

<script lang="ts">
import copy from 'fast-copy'
import Vue, { PropType } from 'vue'

import { FilterValueDate } from '@/utils/types-filters'

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
    filter: {
      type: Object as PropType<FilterValueDate>,
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

  methods: {
    onChange(value: string | null) {
      const newFilter = copy(this.filter)

      if (value) {
        const dateRange = this.dateFilters.find(
          (e: DateFilterOption) => e.value === value
        )

        if (dateRange) {
          newFilter.filterValueBegin = dateRange.begin
          newFilter.filterValueEnd = dateRange.end
        }
      } else {
        newFilter.filterValueBegin = null
        newFilter.filterValueEnd = null
      }

      this.$emit('change', newFilter)
    },

    currentValue() {
      return this.dateFilters.find(
        (e) =>
          e.begin === this.filter.filterValueBegin &&
          e.end === this.filter.filterValueEnd
      )?.value
    },
  },
})
</script>
