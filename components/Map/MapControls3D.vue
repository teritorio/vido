<template>
  <div
    ref="container"
    :class="['maplibregl-ctrl maplibregl-ctrl-group', 'hidden md:block']"
  >
    <button
      id="3D-selector-map"
      :aria-label="$t('mapControls.threeDAriaLabel')"
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
import { PropType, ref } from 'vue'

import { defineNuxtComponent, useNuxtApp } from '#app'

export default defineNuxtComponent({
  props: {
    map: {
      type: Object as PropType<Map>,
      default: null,
    },
  },
  setup() {
    return {
      container: ref<InstanceType<typeof HTMLDivElement>>(),
    }
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
          container: this.container,
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
      const { $tracking } = useNuxtApp()
      $tracking({ type: 'map_control_event', event: '3d' })
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
