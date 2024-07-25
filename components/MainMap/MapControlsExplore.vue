<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Control } from '@teritorio/map'
import type { Map } from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import type { PropType } from 'vue'
import { ref } from 'vue'

import { defineNuxtComponent } from '#app'
import { mapStore as useMapStore } from '~/stores/map'
import { Mode } from '~/utils/types'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

  props: {
    map: {
      type: Object as PropType<Map>,
      default: null,
    },
  },

  setup() {
    const { isModeExplorer, mode } = storeToRefs(useMapStore())

    return {
      container: ref<InstanceType<typeof HTMLDivElement>>(),
      isModeExplorer,
      mode,
    }
  },

  watch: {
    map(value, oldValue) {
      if (!oldValue && value) {
        class BackgroundControl extends Control {
          constructor(container: HTMLDivElement) {
            super(container)
          }
        }

        const control = new BackgroundControl(this.container!)
        this.map.addControl(control)
      }
    },
  },

  methods: {
    toggleMode() {
      this.$tracking({ type: 'map_control_event', event: 'explorer' })
      this.mode = this.isModeExplorer ? Mode.BROWSER : Mode.EXPLORER
    },
  },
})
</script>

<template>
  <div
    ref="container"
    class="maplibregl-ctrl maplibregl-ctrl-group tw-hidden md:tw-block"
  >
    <button
      :aria-label="$t('mapControls.exploreAriaLabel')"
      :title="$t('mapControls.exploreButton')"
      type="button"
      class="tw-hidden md:tw-block" :class="[
        isModeExplorer && 'maplibregl-ctrl-active',
      ]"
      @click="toggleMode"
    >
      <FontAwesomeIcon
        icon="eye"
        :class="[
          isModeExplorer && 'tw-text-white',
          !isModeExplorer && 'tw-text-zinc-800',
        ]"
        size="lg"
      />
    </button>
  </div>
</template>
