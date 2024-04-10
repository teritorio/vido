<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import type { ApiPoiProperties } from '~/lib/apiPois'

export default defineNuxtComponent({
  props: {
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      default: null,
    },
  },

  computed: {
    address() {
      const { addressToString } = useField()
      return addressToString(this.properties)
    },
  },
})
</script>

<template>
  <div>
    <slot />
    <span>
      {{ address }}
    </span>
  </div>
</template>
