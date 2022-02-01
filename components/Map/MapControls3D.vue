<template>
  <button
    :aria-label="$tc('mapControls.threeDAriaLabel')"
    type="button"
    :class="[
      'hidden items-center justify-center leading-none sm:flex text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none ',
      is3D &&
        'bg-blue-500 text-white hover:bg-blue-400 focus-visible:bg-blue-400',
      !is3D &&
        'bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100',
    ]"
    @click="toggle3D"
  >
    3D
  </button>
</template>

<script lang="ts">
import { Building3d } from '@teritorio/map'
import Vue from 'vue'

import { getHashPart } from '@/utils/url'

export default Vue.extend({
  props: {
    map: {
      type: Object,
      default: null,
    },
    pitch: {
      type: Number,
      default: 0,
    },
  },

  data(): {
    building3d: Building3d | null
    is3D: boolean
  } {
    return {
      building3d: null,
      is3D: false,
    }
  },

  watch: {
    pitch(value) {
      if (this.building3d) {
        this.building3d.set3d(value !== 0)
      }

      this.setIs3D(value !== 0)
    },
  },

  created() {
    this.setIs3D(this.pitch !== 0)
  },

  mounted() {
    const mapParams: string | null = getHashPart('map')
    const params: string[] | undefined = mapParams?.split('/')

    if (params && params.length > 4) {
      this.setIs3D(true)
    }

    this.building3d = new Building3d({
      building3d: this.is3D,
    })
    this.map.addControl(this.building3d)
  },

  methods: {
    setIs3D(value: boolean) {
      this.is3D = value
    },

    toggle3D() {
      this.$tracking({ type: 'map_control_event', event: '3d' })
      if (this.building3d) {
        if (this.is3D) {
          this.building3d.set3d(false, 0)
        } else {
          this.building3d.set3d(true, 60)
        }

        this.setIs3D(!this.is3D)
      }
    },
  },
})
</script>
