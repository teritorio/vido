<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import type { ApiPoiProperties } from '~/lib/apiPois'

const addressFields = [
  'addr:housenumber',
  'addr:street',
  'addr:postcode',
  'addr:city',
]

export function isAddressFieldEmpty(properties: {
  [key: string]: string
}): boolean {
  return addressFields.reduce(
    (sum: boolean, value) => sum || value in properties,
    false,
  )
}

export default defineNuxtComponent({
  props: {
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      default: null,
    },
  },

  computed: {
    address(): string | null {
      return addressFields
        .map(field => this.properties[field])
        .map(f => (f || '').toString().trim())
        .filter(f => f)
        .join(' ')
    },
  },
})
</script>

<template>
  <div v-if="address">
    <slot />
    <span>
      {{ address }}
    </span>
  </div>
</template>
