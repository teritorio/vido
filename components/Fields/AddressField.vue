<template>
  <span v-if="address">
    {{ address }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    properties: {
      type: Object,
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
        .filter((f) => f)
        .map((f) => f.toString().trim())
        .filter((f) => f)
        .join(' ')
    },
  },
})
</script>
