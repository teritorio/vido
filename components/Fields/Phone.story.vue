<template>
  <Story title="Fields/Phone">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <Phone v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import Phone from '~/components/Fields/Phone.vue'

const defaultProps = {
  number: '+33676544',
}

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>
