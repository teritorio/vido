<template>
  <div class="mt-12">
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
      value: [this.filter.filterValueMin, this.filter.filterValueMax],
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
      this.$emit('change', value)
    },
  },
})
</script>

<style lang="scss">
@import '@vueform/slider/themes/tailwind.scss';
</style>
