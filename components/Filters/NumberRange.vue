<script lang="ts">
import copy from 'fast-copy'
import type { PropType } from 'vue'
import { VRangeSlider } from 'vuetify/components/VRangeSlider'

import { defineNuxtComponent } from '#app'
import type { FilterValueNumberRange } from '~/utils/types-filters'

export default defineNuxtComponent({
  components: {
    VRangeSlider,
  },

  props: {
    filter: {
      type: Object as PropType<FilterValueNumberRange>,
      required: true,
    },
  },

  emits: {
    change: (_newFilter: FilterValueNumberRange) => true,
  },

  computed: {
    min(): number {
      return this.filter.def.min
    },
    max(): number {
      return this.filter.def.max
    },
    value(): [number, number] {
      return [
        this.filter.filterValueMin != null
          ? this.filter.filterValueMin
          : this.filter.def.min,
        this.filter.filterValueMax != null
          ? this.filter.filterValueMax
          : this.filter.def.max,
      ]
    },
  },

  methods: {
    onChange(value: [number, number]) {
      const newFilter = copy(this.filter)
      newFilter.filterValueMin = value[0]
      newFilter.filterValueMax = value[1]
      this.$emit('change', newFilter)
    },
  },
})
</script>

<template>
  <div class="tw-mt-7 filters-number-range">
    <v-range-slider
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
