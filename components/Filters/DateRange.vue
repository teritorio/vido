<script setup lang="ts">
import copy from 'fast-copy'
import { VSelect } from 'vuetify/components/VSelect'
import { DateFilterLabel, type DateFilterOption } from '~/utils/types'
import type { FilterValueDate } from '~/utils/types-filters'
import { formatDate } from '~/utils/utilities'

const props = defineProps<{
  filter: FilterValueDate
}>()

const emit = defineEmits<{
  (e: 'change', newFilter: FilterValueDate): void
}>()

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

const { t } = useI18n()
const dateFilters = computed(() => ([
  {
    title: t(`dateFilter.${DateFilterLabel.TODAY}`),
    value: DateFilterLabel.TODAY,
    begin: formatDate(today),
    end: formatDate(today),
  },
  {
    title: t(`dateFilter.${DateFilterLabel.TOMORROW}`),
    value: DateFilterLabel.TOMORROW,
    begin: formatDate(tomorrow),
    end: formatDate(tomorrow),
  },
  {
    title: t(`dateFilter.${DateFilterLabel.THIS_WEEKEND}`),
    value: DateFilterLabel.THIS_WEEKEND,
    begin: formatDate(saturday),
    end: formatDate(sunday),
  },
  {
    title: t(`dateFilter.${DateFilterLabel.NEXT_WEEK}`),
    value: DateFilterLabel.NEXT_WEEK,
    begin: formatDate(today),
    end: formatDate(in7days),
  },
  {
    title: t(`dateFilter.${DateFilterLabel.NEXT_MONTH}`),
    value: DateFilterLabel.NEXT_MONTH,
    begin: formatDate(today),
    end: formatDate(in1month),
  },
]))

const currentValue = computed((): string | undefined => {
  return dateFilters.value.find(
    e =>
      e.begin === props.filter.filterValueBegin
      && e.end === props.filter.filterValueEnd,
  )?.value
})

function onChange(value: string | null) {
  const newFilter = copy(props.filter)

  if (value) {
    const dateRange = dateFilters.value.find(
      (e: DateFilterOption) => e.value === value,
    )

    if (dateRange) {
      newFilter.filterValueBegin = dateRange.begin
      newFilter.filterValueEnd = dateRange.end
    }
  }
  else {
    newFilter.filterValueBegin = null
    newFilter.filterValueEnd = null
  }

  emit('change', newFilter)
}
</script>

<template>
  <div>
    <VSelect
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
