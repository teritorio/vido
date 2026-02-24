<script lang="ts" setup>
import Select from '~/components/Filters/Select.vue'
import type { FilterList } from '~/types/api/filters'
import { FilterValueList } from '~/utils/types-filters'

const def: FilterList = {
  type: 'multiselection',
  property: ['string'],
  name: { fr: 'plop' },
  values: [
    {
      value: 'a',
      name: { en: 'a' },
    },
    {
      value: 'b',
      name: { en: 'b' },
    },
  ],
}

const filter = new FilterValueList(def)

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
  <Story title="Filters/Select">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <Select v-bind="p" class="v-locale--is-ltr" />
    </Variant>
  </Story>
</template>
