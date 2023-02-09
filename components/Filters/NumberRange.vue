<template>
  <div class="filters-number-range mt-12">
    <Slider
      v-model="value"
      :min="min"
      :max="max"
      :merge="(max - min) / 10"
      @set="onChange"
    />
  </div>
</template>

<script lang="ts">
import Slider from '@vueform/slider/dist/slider.vue2.js'
import copy from 'fast-copy'
import Vue, { PropType } from 'vue'

import { FilterValueNumberRange } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    Slider,
  },

  props: {
    filter: {
      type: Object as PropType<FilterValueNumberRange>,
      required: true,
    },
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
    min(): number | null {
      return this.filter.def.min
    },
    max(): number | null {
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

<style lang="scss">
@import '@vueform/slider/themes/tailwind.scss';
</style>
