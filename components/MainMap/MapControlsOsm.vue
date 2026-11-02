<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Control } from '@teritorio/map'
import type { Map } from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import { useContribStore } from '~/stores/contrib'
import { useSiteStore } from '~/stores/site'

const props = defineProps<{
  map?: Map
}>()

const { t } = useI18n()
const { enabled: contribMode } = storeToRefs(useContribStore())
const { osmNoteControlEnabled } = storeToRefs(useSiteStore())
const container = ref<HTMLDivElement>()

const showNote = computed(() => contribMode.value || osmNoteControlEnabled.value)
const showEditor = contribMode

watch(() => props.map, (newValue, oldValue) => {
  if (!oldValue && newValue && container.value) {
    class OsmControl extends Control {
      constructor(el: HTMLDivElement) { super(el) }
    }
    newValue.addControl(new OsmControl(container.value))
  }
})

function openOsmNote() {
  if (!props.map)
    return

  const { lat, lng } = props.map.getCenter()
  const zoom = Math.floor(props.map.getZoom())
  window.open(
    `https://www.openstreetmap.org/note/new#map=${zoom}/${lat}/${lng}&layers=N`,
    '_blank',
    'noopener,noreferrer',
  )
}

function openOsmEditor() {
  if (!props.map)
    return

  const { lat, lng } = props.map.getCenter()
  const zoom = Math.floor(props.map.getZoom())
  window.open(
    `https://www.openstreetmap.org/edit?editor=id#map=${zoom}/${lat}/${lng}`,
    '_blank',
    'noopener,noreferrer',
  )
}
</script>

<template>
  <div
    ref="container"
    class="maplibregl-ctrl maplibregl-ctrl-group"
  >
    <button
      v-if="showNote"
      :aria-label="t('mapControls.osmNoteAriaLabel')"
      :title="t('mapControls.osmNoteButton')"
      type="button"
      @click="openOsmNote"
    >
      <FontAwesomeIcon
        icon="message"
        class="tw-text-zinc-800"
        size="lg"
      />
    </button>
    <button
      v-if="showEditor"
      :aria-label="t('mapControls.osmEditorAriaLabel')"
      :title="t('mapControls.osmEditorButton')"
      type="button"
      @click="openOsmEditor"
    >
      <FontAwesomeIcon
        icon="pen-to-square"
        class="tw-text-zinc-800"
        size="lg"
      />
    </button>
  </div>
</template>
