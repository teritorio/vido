<template>
  <Story title="Fields/DateRange">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <DateRange v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import DateRange from '~/components/Fields/DateRange.vue'

const defaultProps = {
  start: '01/01/01',
  end: '02/02/02',
}

const props = {
  Default: {
    ...defaultProps,
  },
  DefaultStart: {
    ...defaultProps,
    end: undefined,
  },
  DefaultEnd: {
    ...defaultProps,
    start: undefined,
  },
  DefaultSame: {
    ...defaultProps,
    end: defaultProps.start,
  },
}
</script>
