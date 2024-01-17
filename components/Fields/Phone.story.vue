<script lang="ts" setup>
import { ref } from 'vue'

import Phone from '~/components/Fields/Phone.vue'

const devices = {
  desktop: {
    smallScreen: false,
    touch: false,
    phone: false,
  },
  mobile: {
    smallScreen: true,
    touch: true,
    phone: true,
  },
}

function setupApp(device: (typeof devices)[keyof typeof devices]) {
  // @ts-expect-error
  return ({ app, _story, _variant }) => {
    app.config.globalProperties.$device = ref(device)
  }
}

const defaultProps = {
  number: '+33676544',
}

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>

<template>
  <Story title="Fields/Phone">
    <div v-for="(p, name) in props" :key="name">
      <div v-for="(device, id) in devices" :key="id">
        <Variant
          :title="`${name.replace(/([A-Z])/g, ' $1').trim()} - ${id}`"
          :setup-app="setupApp(device)"
        >
          <Phone v-bind="p" />
        </Variant>
      </div>
    </div>
  </Story>
</template>
