<template>
  <button
    id="3D-selector-map"
    :aria-label="$tc('mapControls.threeDAriaLabel')"
    type="button"
    :class="[
      'hidden md:block items-center justify-center leading-none md:flex text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none ',
      pitch != 0 &&
        'bg-blue-500 text-white hover:bg-blue-400 focus-visible:bg-blue-400',
      pitch == 0 &&
        'bg-white text-zinc-800 hover:bg-zinc-100 focus-visible:bg-zinc-100',
    ]"
    @click="toggle3D"
  >
    3D
  </button>
</template>

<script lang="ts">
import { Building3d } from '@teritorio/map'
import { Map } from 'maplibre-gl'
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    map: {
      type: Object as PropType<Map>,
      default: null,
    },
    pitch: {
      type: Number,
      default: 0,
    },
  },

  data(): {
    building3d: Building3d
  } {
    return {
      building3d: new Building3d({
        building3d: this.pitch !== 0,
      }),
    }
  },

  watch: {
    pitch(value) {
      if (this.building3d) {
        this.building3d.set3d(value !== 0)
      }
    },
  },

  mounted() {
    this.map.addControl(this.building3d)
  },

  methods: {
    toggle3D() {
      this.$tracking({ type: 'map_control_event', event: '3d' })
      if (this.building3d) {
        if (this.pitch !== 0) {
          this.building3d.set3d(false, 0)
        } else {
          this.building3d.set3d(true, 60)
        }
      }
    },
  },
})
</script>
