<script setup lang="ts">
import copy from 'fast-copy'
import { VRangeSlider } from 'vuetify/components/VRangeSlider'
import type { FilterValueNumberRange } from '~/utils/types-filters'

const props = defineProps<{
  filter: FilterValueNumberRange
}>()

const emit = defineEmits<{
  (e: 'change', newFilter: FilterValueNumberRange): void
}>()

const min = computed((): number => {
  return props.filter.def.min
})

const max = computed((): number => {
  return props.filter.def.max
})

const value = computed((): [number, number] => {
  return [
    props.filter.filterValueMin != null
      ? props.filter.filterValueMin
      : props.filter.def.min,
    props.filter.filterValueMax != null
      ? props.filter.filterValueMax
      : props.filter.def.max,
  ]
})

function onChange(value: [number, number]) {
  const newFilter = copy(props.filter)
  newFilter.filterValueMin = value[0]
  newFilter.filterValueMax = value[1]
  emit('change', newFilter)
}
</script>

<template>
  <div class="tw-mt-7 filters-number-range">
    <VRangeSlider
      :model-value="value"
      strict
      :min="min"
      :max="max"
      thumb-label="always"
      hide-details="auto"
      :step="Math.max(Math.round((max - min) / 50), 1)"
      @update:model-value="onChange"
    />
  </div>
</template>
