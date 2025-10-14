<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Control } from '@teritorio/map'
import type { Map } from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import { mapStore as useMapStore } from '~/stores/map'
import { Mode } from '~/utils/types'

const props = defineProps<{
  map?: Map
}>()

const { t } = useI18n()
const { $tracking } = useNuxtApp()
const { isModeExplorer, mode } = storeToRefs(useMapStore())
const container = ref<InstanceType<typeof HTMLDivElement>>()

watch(() => props.map, (newValue, oldValue) => {
  if (!oldValue && newValue) {
    class BackgroundControl extends Control {
      constructor(container: HTMLDivElement) {
        super(container)
      }
    }

    if (container.value) {
      const control = new BackgroundControl(container.value!)
      newValue.addControl(control)
    }
  }
})

function toggleMode() {
  $tracking({ type: 'map_control_event', event: 'explorer' })
  mode.value = isModeExplorer.value ? Mode.BROWSER : Mode.EXPLORER
}
</script>

<template>
  <div
    ref="container"
    class="maplibregl-ctrl maplibregl-ctrl-group tw-hidden md:tw-block"
  >
    <button
      :aria-label="t('mapControls.exploreAriaLabel')"
      :title="t('mapControls.exploreButton')"
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
