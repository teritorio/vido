<template>
  <div class="filters-number-range">
    <v-range-slider
      v-model="value"
      strict
      :min="min"
      :max="max"
      thumb-label="always"
      @update:model-value="onChange"
    ></v-range-slider>
  </div>
</template>

<script lang="ts">
import copy from 'fast-copy'
import { PropType } from 'vue'
import { VRangeSlider } from 'vuetify/components/VRangeSlider'

import { defineNuxtComponent } from '#app'
import { FilterValueNumberRange } from '~/utils/types-filters'

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
    change: (newFilter: FilterValueNumberRange) => true,
  },

  data(): {
    value: [number, number]
  } {
    return {
      value: [
        this.filter.filterValueMin != null
          ? this.filter.filterValueMin
          : this.filter.def.min,
        this.filter.filterValueMax != null
          ? this.filter.filterValueMax
          : this.filter.def.max,
      ],
    }
  },

  computed: {
    min(): number {
      return this.filter.def.min
    },
    max(): number {
      return this.filter.def.max
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
