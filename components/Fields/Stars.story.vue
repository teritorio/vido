<script lang="ts" setup>
import { StarsEnum } from '~/utils/types'
import Stars from '~/components/Fields/Stars.vue'

const defaultProps = {
  stars: StarsEnum.Three,
}

const props = {
  Default: {
    ...defaultProps,
  },
  More: {
    stars: StarsEnum.FiveS,
  },
}
</script>

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
