<template>
  <div>
    <v-select
      :model-value="currentValue"
      outlined
      :label="filter.def.name && filter.def.name.fr"
      :items="dateFilters"
      :clearable="true"
      hide-details="auto"
      @update:model-value="onChange"
    />
  </div>
</template>

<script lang="ts">
import copy from 'fast-copy'
import { PropType } from 'vue'
import { VSelect } from 'vuetify/components/VSelect'

import { defineNuxtComponent } from '#app'
import { FilterValueDate } from '~/utils/types-filters'

export enum DateFilterLabel {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEKEND = 'thisWeekend',
  NEXT_WEEK = 'nextWeek',
  NEXT_MONTH = 'nextMonth',
}

export type DateFilterOption = {
  title: string
  value: string
  begin: string
  end: string
}

function formatDate(date: Date): string {
  return (
    date.getFullYear().toString() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0')
  )
}

export default defineNuxtComponent({
  components: {
    VSelect,
  },

  props: {
    filter: {
      type: Object as PropType<FilterValueDate>,
      required: true,
    },
  },

  emits: {
    change: (_newFilter: FilterValueDate) => true,
  },

  data(): {
    dateFilters: DateFilterOption[]
  } {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const saturday = new Date(today)
    saturday.setDate(saturday.getDate() + ((6 + (7 - saturday.getDay())) % 7))

    const sunday = new Date(saturday)
    sunday.setDate(saturday.getDate() + 1)

    const in7days = new Date(today)
    in7days.setDate(in7days.getDate() + 7)

    const in1month = new Date(today)
    in1month.setMonth(in1month.getMonth() + 1)

    return {
      dateFilters: [
        {
          title: this.$t('dateFilter.' + DateFilterLabel.TODAY),
          value: DateFilterLabel.TODAY,
          begin: formatDate(today),
          end: formatDate(today),
        },
        {
          title: this.$t('dateFilter.' + DateFilterLabel.TOMORROW),
          value: DateFilterLabel.TOMORROW,
          begin: formatDate(tomorrow),
          end: formatDate(tomorrow),
        },
        {
          title: this.$t('dateFilter.' + DateFilterLabel.THIS_WEEKEND),
          value: DateFilterLabel.THIS_WEEKEND,
          begin: formatDate(saturday),
          end: formatDate(sunday),
        },
        {
          title: this.$t('dateFilter.' + DateFilterLabel.NEXT_WEEK),
          value: DateFilterLabel.NEXT_WEEK,
          begin: formatDate(today),
          end: formatDate(in7days),
        },
        {
          title: this.$t('dateFilter.' + DateFilterLabel.NEXT_MONTH),
          value: DateFilterLabel.NEXT_MONTH,
          begin: formatDate(today),
          end: formatDate(in1month),
        },
      ],
    }
  },

  computed: {
    currentValue(): string | undefined {
      return this.dateFilters.find(
        (e) =>
          e.begin === this.filter.filterValueBegin &&
          e.end === this.filter.filterValueEnd
      )?.value
    },
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
  },
})
</script>
