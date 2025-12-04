<script setup lang="ts">
import { Control } from '@teritorio/map'
import type { Map } from 'maplibre-gl'
import { DEFAULT_MAP_STYLE, MAP_STYLE_NAMES } from '~/lib/constants'
import { MapStyleEnum } from '~/utils/types'
import { getHashPart, routerPushHashUpdate } from '~/utils/url'

const props = withDefaults(defineProps<{
  map?: Map
  backgrounds: MapStyleEnum[]
  initialBackground: MapStyleEnum
  hidden?: boolean
}>(), {
  hidden: false,
})

const emit = defineEmits<{
  (e: 'changeBackground', background: MapStyleEnum): void
}>()

const container = ref<InstanceType<typeof HTMLDivElement>>()
const activeBackground = ref<MapStyleEnum>(props.initialBackground)

const backgroundImages = computed(() => Object.fromEntries(
  props.backgrounds.map((background) => {
    const imageUrl = new URL(
        `../../assets/${background}.png`,
        import.meta.url,
    ).href
    return [background, imageUrl]
  }),
))

const router = useRouter()

watch(() => props.map, (newValue, oldValue) => {
  if (!oldValue && newValue) {
    const bgString = getHashPart(router, 'bg')
    const bg = MapStyleEnum[bgString as keyof typeof MapStyleEnum]
    if (bg && props.backgrounds.includes(bg))
      activeBackground.value = bg
    else
      activeBackground.value = props.initialBackground

    class BackgroundControl extends Control {
      constructor(container: HTMLDivElement) {
        super(container)
      }
    }

    if (props.map && container.value) {
      const control = new BackgroundControl(container.value)
      props.map.addControl(control)
    }
  }
})

const { $tracking } = useNuxtApp()

function name(background: keyof typeof MapStyleEnum) {
  return MAP_STYLE_NAMES[background]
}

function changeBackground(background: MapStyleEnum) {
  $tracking({
    type: 'map_control_event',
    event: 'background',
    background,
  })

  activeBackground.value = background
  routerPushHashUpdate(router, {
    bg: background !== DEFAULT_MAP_STYLE ? background : null,
  })
  emit('changeBackground', background)
}
</script>

<template>
  <div ref="container" class="maplibregl-ctrl maplibregl-ctrl-group">
    <template v-for="background in backgrounds">
      <button
        v-if="!hidden"
        :id="`background-selector-map-${background}`"
        :key="background"
        :aria-label="$t('mapControls.backgroundAriaLabel')"
        :class="[activeBackground === background && 'maplibregl-ctrl-active']"
        :title="
          $t('mapControls.backgroundButton', {
            background: name(background),
          })
        "
        type="button"
        @click="changeBackground(background)"
      >
        <span class="tw-block tw-h-full tw-p-1">
          <img
            class="tw-rounded-full tw-bg-white"
            alt="fond de carte"
            :src="backgroundImages[background]"
          >
        </span>
      </button>
    </template>
  </div>
</template>
