<template>
  <div class="absolute flex flex-col space-y-0 top-3 right-3">
    <button
      aria-label="Visualiser la carte en 2D"
      type="button"
      class="px-4 py-3 text-gray-800 bg-white rounded-t-full shadow-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
      @click="setFlat"
    >
      <font-awesome-icon :icon="['far', 'square']" />
    </button>

    <button
      aria-label="Visualiser la carte en 3D"
      type="button"
      class="px-4 py-3 text-gray-800 bg-white rounded-b-full shadow-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
      @click="set3D"
    >
      <font-awesome-icon icon="cube" />
    </button>
  </div>
</template>

<script lang="ts">
import { building3d } from '@teritorio/map'
import Vue from 'vue'

export default Vue.extend({
  props: {
    map: {
      type: Object,
      default: null,
    },
  },
  methods: {
    setFlat() {
      if (this.map) {
        building3d(this.map).set3d(false, 0)
      }
    },
    set3D() {
      if (this.map) {
        building3d(this.map).set3d(true, 60)
      }
    },
  },
})
</script>
