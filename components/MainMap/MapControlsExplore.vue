<template>
  <div
    ref="container"
    :class="[
      'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group',
      'hidden md:block',
    ]"
  >
    <button
      :aria-label="$tc('mapControls.exploreAriaLabel')"
      :title="$tc('mapControls.exploreButton')"
      type="button"
      :class="['hidden md:block', isModeExplorer && 'maplibregl-ctrl-active']"
      @click="toggleMode"
    >
      <font-awesome-icon
        icon="eye"
        :class="[
          isModeExplorer && 'text-white',
          !isModeExplorer && 'text-zinc-800',
        ]"
        size="lg"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { Control } from '@teritorio/map'
import { Map } from 'maplibre-gl'
import { mapActions, mapState } from 'pinia'
import Vue, { PropType, VueConstructor } from 'vue'

import { mapStore } from '~/stores/map'
import { Mode } from '~/utils/types'

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

  computed: {
    ...mapState(mapStore, ['isModeExplorer']),
  },

  watch: {
    map(value, oldValue) {
      if (!oldValue && value) {
        class BackgroundControl extends Control {
          constructor(container: HTMLDivElement) {
            super(container)
          }
        }

        const control = new BackgroundControl(this.$refs.container)
        this.map.addControl(control)
      }
    },
  },

  methods: {
    ...mapActions(mapStore, ['setMode']),

    toggleMode() {
      this.$tracking({ type: 'map_control_event', event: 'explorer' })
      this.setMode(this.isModeExplorer ? Mode.BROWSER : Mode.EXPLORER)
    },
  },
})
</script>
