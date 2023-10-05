<template>
  <Story title="Fields/Stars">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <Stars v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import Stars from '~/components/Fields/Stars.vue'

let defaultProps = {
  stars: 3,
}

const props = {
  Default: {
    ...defaultProps,
  },
  More: {
    stars: 10,
  },
  None: {
    stars: 0,
  },
}
</script>
