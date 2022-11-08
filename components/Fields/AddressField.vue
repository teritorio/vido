<template>
  <div v-if="address">
    <slot />
    <span>
      {{ address }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ApiPoiProperties } from '~/lib/apiPois'

export default Vue.extend({
  props: {
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      default: null,
    },
  },

  computed: {
    address(): string | null {
      return [
        this.properties['addr:housenumber'],
        this.properties['addr:street'],
        this.properties['addr:postcode'],
        this.properties['addr:city'],
      ]
        .map((f) => (f || '').toString().trim())
        .filter((f) => f)
        .join(' ')
    },
  },
})
</script>
