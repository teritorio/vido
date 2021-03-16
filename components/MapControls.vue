<template>
  <div class="absolute flex flex-col space-y-0 top-3 right-3">
    <button
      aria-label="Visualiser la carte en 3D"
      type="button"
      :class="[
        'text-sm font-bold rounded-full shadow-md w-11 h-11 focus:outline-none',
        is3D &&
          'bg-blue-500 text-white hover:bg-blue-400 focus-visible:bg-blue-400',
        !is3D &&
          'bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100',
      ]"
      @click="toggle3D"
    >
      3D
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
  data(): {
    is3D: boolean
  } {
    return {
      is3D: false,
    }
  },
  methods: {
    toggle3D() {
      if (this.map) {
        if (this.is3D) {
          building3d(this.map).set3d(false, 0)
        } else {
          building3d(this.map).set3d(true, 60)
        }

        this.is3D = !this.is3D
      }
    },
  },
})
</script>
