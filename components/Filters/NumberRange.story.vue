<script lang="ts" setup>
import NumberRange from '~/components/Filters/NumberRange.vue'
import type { FilterNumberRange } from '~/types/api/filters'
import { FilterValueNumberRange } from '~/utils/types-filters'

const def: FilterNumberRange = {
  type: 'number_range',
  property: ['string'],
  name: { fr: 'plop' },
  min: 20,
  max: 120,
}

const filter = new FilterValueNumberRange(def)
filter.filterValueMin = 50
filter.filterValueMax = 70

const defaultProps = {
  filter,
}

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>

<template>
  <Story title="Filters/NumberRange">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <NumberRange v-bind="p" class="v-locale--is-ltr" />
    </Variant>
  </Story>
</template>
