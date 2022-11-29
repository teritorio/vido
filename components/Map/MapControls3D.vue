<template>
  <div
    ref="container"
    :class="[
      'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group',
      'hidden md:block',
    ]"
  >
    <button
      id="3D-selector-map"
      :aria-label="$tc('mapControls.threeDAriaLabel')"
      type="button"
      :class="pitched && 'maplibregl-ctrl-active'"
      @click="toggle3D"
    >
      3D
    </button>
  </div>
</template>

<script lang="ts">
import { Building3d } from '@teritorio/map'
import { Map } from 'maplibre-gl'
import Vue, { VueConstructor, PropType } from 'vue'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        container: InstanceType<typeof HTMLDivElement>
      }
    }
  >
).extend({
  props: {
    map: {
      type: Object as PropType<Map>,
      default: null,
    },
  },

  data(): {
    building3d: Building3d | null
    pitched: boolean
  } {
    return {
      building3d: null,
      pitched: false,
    }
  },

  watch: {
    map(value, oldValue) {
      if (!oldValue && value) {
        this.building3d = new Building3d({
          building3d: this.pitched,
          // @ts-ignore
          container: this.$refs.container,
        })

        this.map.addControl(this.building3d)
        this.pitched = this.map.getPitch() != 0

        this.map.on('pitchend', () => {
          this.pitched = this.map.getPitch() != 0
        })
      }
    },
  },

  methods: {
    toggle3D() {
      this.$tracking({ type: 'map_control_event', event: '3d' })
      if (this.building3d) {
        if (this.pitched) {
          this.building3d.set3d(false, 0)
        } else {
          this.building3d.set3d(true, 60)
        }
      }
    },
  },
})
</script>
