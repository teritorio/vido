<script lang="ts" setup>
import DateRange from '~/components/Filters/DateRange.vue'
import type { FilterDate } from '~/types/api/menu'
import { FilterValueDate } from '~/utils/types-filters'

const def: FilterDate = {
  type: 'date_range',
  property_begin: 'begin',
  property_end: 'end',
  name: { fr: 'plop' },
}

const filter = new FilterValueDate(def)
filter.filterValueBegin = '01/01/01'
filter.filterValueEnd = '02/02/02'

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
  <Story title="Filters/DateRange">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <DateRange v-bind="p" />
    </Variant>
  </Story>
</template>
