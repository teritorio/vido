<template>
  <Story title="UI/IconButton">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <IconButton v-bind="p">ABC</IconButton>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import IconButton from '~/components/UI/IconButton.vue'
import '@teritorio/font-teritorio/teritorio/teritorio.css'

const defaultProps = {
  label: 'Plop',
}

const props = {
  DefaultButton: {
    ...defaultProps,
  },
  DefaultLink: {
    ...defaultProps,
    href: 'https://www.teritorio.fr/',
  },
}
</script>
