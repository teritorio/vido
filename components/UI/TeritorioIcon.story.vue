<script lang="ts" setup>
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'

const defaultProps = {
  picto: 'teritorio teritorio-restaurant',
  colorText: '#000000',
  // useNativeAlignment:
}

const props = {
  Default: {
    ...defaultProps,
  },
  TextColor: {
    ...defaultProps,
    colorText: '#ff0000',
  },
  Fontawesome: {
    ...defaultProps,
    picto: 'phone',
  },
  FontawesomeTextColor: {
    ...defaultProps,
    picto: 'phone',
    colorText: '#ff0000',
  },
  Image: {
    ...defaultProps,
    image:
      'https://www.teritorio.fr/wp-content/themes/teritorio/img/favicon/favicon-194x194.png',
  },
}
</script>

<template>
  <Story title="UI/TeritorioIcon">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <TeritorioIcon v-bind="p" />
    </Variant>
  </Story>
</template>
