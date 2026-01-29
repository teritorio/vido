<script setup lang="ts">
import { OpenMapTilesLanguage } from '@teritorio/openmaptiles-gl-language'
import type {
  FitBoundsOptions,
  LngLatBounds,
  LngLatLike,
  MapDataEvent,
  MapLibreEvent,
  MapTouchEvent,
  RasterSourceSpecification,
  StyleSpecification,
  VectorSourceSpecification,
} from 'maplibre-gl'
import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
} from 'maplibre-gl'
import { storeToRefs } from 'pinia'
import { DEFAULT_MAP_STYLE, MAP_ZOOM } from '~/lib/constants'
import { useSiteStore } from '~/stores/site'
import { fetchStyle } from '~/utils/styles'
import { MapStyleEnum } from '~/utils/types'

type ITMap = InstanceType<typeof Map>
type ITAttributionControl = InstanceType<typeof AttributionControl>

const props = withDefaults(defineProps<{
  mapStyle?: MapStyleEnum
  bounds?: LngLatBounds
  fitBoundsOptions?: FitBoundsOptions
  extraAttributions?: string[]
  center?: LngLatLike
  zoom?: number
  rotate?: boolean
  fullscreenControl?: boolean
  hash?: string
  showAttribution?: boolean
  hideControl?: boolean
  cooperativeGestures?: boolean
}>(), {
  mapStyle: DEFAULT_MAP_STYLE,
  fitBoundsOptions: () => ({
    padding: 50,
    maxZoom: 17,
  }),
  extraAttributions: () => ([]),
  rotate: false,
  fullscreenControl: false,
  showAttribution: true,
  hideControl: false,
  cooperativeGestures: false,
})

const emit = defineEmits<{
  (e: 'mapInit', map: ITMap): void
  (e: 'mapData', event: MapDataEvent & object): void
  (e: 'mapDragEnd', event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & object): void
  (e: 'mapMoveEnd', event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
  object): void
  (e: 'mapResize', event: MapLibreEvent<unknown> & object): void
  (e: 'mapRotateEnd', event: MapLibreEvent<MouseEvent | TouchEvent | undefined> & object): void
  (e: 'mapTouchMove', event: MapTouchEvent & object): void
  (e: 'mapZoomEnd', event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
  object): void
  (e: 'mapZoomStart', event: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> &
  object): void
  (e: 'fullAttribution', attribution: string): void
  (e: 'mapStyleLoad', style: StyleSpecification): void
}>()

const { theme } = storeToRefs(useSiteStore())
const { t, locale } = useI18n()

if (!theme.value)
  throw createError({ statusCode: 400, statusMessage: 'Theme is missing', fatal: true })

const map = ref<ITMap>()
const style = ref<StyleSpecification>()
const mapStyleCache = ref<Record<string, StyleSpecification>>({})
const attributionControl = ref<ITAttributionControl>()
const languageControl = ref<OpenMapTilesLanguage>()
const fullscreenControlObject = ref<FullscreenControl>()
const withMap = ref<any[]>([])

const defaultZoom = computed(() => MAP_ZOOM.zoom)

watch(() => props.mapStyle, (newValue: MapStyleEnum) => {
  setStyle(newValue)
})

watch(() => props.showAttribution, (enable: boolean) => {
  if (enable)
    addAttribution()
  else
    removeAttribution()
})

watch(locale, (locale: string) => {
  setLanguage(locale)
})

watch(() => props.bounds, (newValue) => {
  if (newValue)
    map.value?.fitBounds(newValue, props.fitBoundsOptions)
})

function doWithMap(lambda: () => void) {
  if (map.value)
    lambda()
  else
    withMap.value.push(lambda)
}

function onMapInit(newMap: ITMap) {
  emit('mapInit', newMap)

  map.value = newMap
  languageControl.value = new OpenMapTilesLanguage({
    defaultLanguage: locale.value || undefined,
  })

  if (props.showAttribution)
    addAttribution()

  map.value.addControl(languageControl.value)

  if (!props.rotate) {
    map.value.dragRotate.disable()
    map.value.touchZoomRotate.disableRotation()
  }

  new ResizeObserver((_entries) => {
    map.value?.resize()
  }).observe(document.getElementById('map')!)

  while (withMap.value.length > 0)
    withMap.value.pop()()
}

function setStyle(mapStyle: MapStyleEnum) {
  getStyle(mapStyle)
    .then((fetchedStyle) => {
      if (!fetchedStyle)
        return

      let s: StyleSpecification = fetchedStyle
      const vectorSource = Object.values(s.sources || []).find(
        source => ['vector', 'raster'].lastIndexOf(source.type) >= 0,
      ) as VectorSourceSpecification | RasterSourceSpecification | undefined
      if (vectorSource?.attribution)
        emit('fullAttribution', vectorSource.attribution)

      style.value = s
      doWithMap(() => {
        // Use no diff mode to avoid issue with added layers
        map.value!.setStyle(s, {
          diff: false,
          transformStyle: (previousStyle, nextStyle) => {
            if (previousStyle?.sources.isochrone) {
              s = {
                ...nextStyle,
                sources: {
                  ...nextStyle.sources,
                  isochrone: previousStyle.sources.isochrone,
                },
                layers: [
                  ...nextStyle.layers,
                  ...previousStyle.layers.filter(l => l.id.includes('isochrone')),
                ],
              }
            }
            return s
          },
        })
        emitStyleLoad()
      })
    })
    .catch((e) => {
      console.error('Vido error:', (e as Error).message)
    })
}

function emitStyleLoad() {
  if (map.value) {
    const styleEvent = (e: MapDataEvent) => {
      if (map.value && e.dataType === 'style' && style.value) {
        map.value.off('styledata', styleEvent)
        emit('mapStyleLoad', style.value as StyleSpecification)
      }
    }
    map.value.on('styledata', styleEvent)
  }
}

async function getStyle(mapStyle: MapStyleEnum): Promise<StyleSpecification | undefined> {
  if (mapStyleCache.value[mapStyle]) {
    return mapStyleCache.value[mapStyle]
  }
  else {
    const styleURLs: Record<MapStyleEnum, string | undefined> = {
      [MapStyleEnum.vector]: theme.value!.map_style_base_url,
      [MapStyleEnum.aerial]: theme.value!.map_style_satellite_url,
      [MapStyleEnum.bicycle]: theme.value?.map_bicycle_style_url,
    }
    const styleUrl = styleURLs[mapStyle]
    if (!styleUrl)
      return undefined

    const style = await fetchStyle(
      styleUrl,
      props.extraAttributions,
    )
    mapStyleCache.value[mapStyle] = style

    return style
  }
}

function addAttribution() {
  doWithMap(() => {
    if (!attributionControl.value) {
      attributionControl.value = new AttributionControl({ compact: false })
      map.value!.addControl(attributionControl.value)
    }
  })
}

function removeAttribution() {
  doWithMap(() => {
    if (attributionControl.value) {
      map.value!.removeControl(attributionControl.value)
      attributionControl.value = undefined
    }
  })
}

function setLanguage(locale: string) {
  languageControl.value?.setLanguage(locale)
}

onBeforeMount(() => {
  setStyle(props.mapStyle)
})

onMounted(() => {
  const mapContainer = document.getElementById('map')

  if (!mapContainer || !mapContainer.parentElement)
    return

  fullscreenControlObject.value = new FullscreenControl({
    container: mapContainer.parentElement,
  })

  const newMap = new Map({
    container: 'map',
    style: style.value || {
      version: 8,
      sources: {},
      layers: [
        {
          id: 'bg',
          type: 'background',
          paint: { 'background-color': '#f8f4f0' },
        },
      ],
    },
    center: props.center,
    zoom: props.zoom,
    bounds: props.bounds,
    fitBoundsOptions: props.fitBoundsOptions,
    hash: props.hash,
    maxZoom: defaultZoom.value.max,
    minZoom: defaultZoom.value.min,
    attributionControl: false,
    cooperativeGestures: props.cooperativeGestures,
    locale: {
      'NavigationControl.ResetBearing':
          t('mapControls.resetBearing') || 'Reset bearing to north',
      'NavigationControl.ZoomIn': t('mapControls.zoomIn') || 'Zoom in',
      'NavigationControl.ZoomOut':
          t('mapControls.zoomOut') || 'Zoom out',
    },
  })

  newMap?.on('load', _event => onMapInit(newMap))
  newMap?.on('data', $event => emit('mapData', $event))
  newMap?.on('dragend', $event => emit('mapDragEnd', $event))
  newMap?.on('moveend', $event => emit('mapMoveEnd', $event))
  newMap?.on('resize', $event => emit('mapResize', $event))
  newMap?.on('rotateend', $event => emit('mapRotateEnd', $event))
  newMap?.on('touchmove', $event => emit('mapTouchMove', $event))
  newMap?.on('zoomend', $event => emit('mapZoomEnd', $event))
  newMap?.on('zoomstart', $event => emit('mapZoomStart', $event))

  newMap?.addControl(
    new NavigationControl({
      showZoom: true,
      showCompass: props.rotate,
      visualizePitch: true,
    }),
  )

  const geolocateControl = new GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
  })
  newMap?.addControl(geolocateControl)
  geolocateControl._container.classList.add('control-geolocate')

  if (props.fullscreenControl && fullscreenControlObject.value)
    newMap?.addControl(fullscreenControlObject.value)

  newMap?.addControl(
    new ScaleControl({
      maxWidth: 80,
    }),
  )
})
</script>

<template>
  <div class="tw-relative" :class="(hideControl || !map) && 'map-controls-hidden'">
    <div id="map" />
    <slot name="controls" />
    <slot name="body" />
    <slot />
  </div>
</template>

<style>
@import 'maplibre-gl/dist/maplibre-gl.css';

.map-controls-hidden .maplibregl-control-container {
  display: none;
}
</style>

<style scoped>
:deep(#map) {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
#map .maplibregl-ctrl-group {
  @apply tw-mt-2 tw-mb-2;

  background: none;
}

#map .maplibregl-ctrl-group:not(:empty) {
  box-shadow: none;
}

#map .maplibregl-ctrl-group > button,
#map .maplibregl-ctrl-group > button:not(:disabled) {
  border: none;

  @apply tw-text-sm tw-font-bold tw-text-zinc-800 tw-bg-white tw-rounded-full tw-shadow-md tw-outline-none tw-w-11 tw-h-11;
  @apply focus:tw-rounded-full focus:tw-shadow-md focus:tw-outline-none focus-visible:tw-bg-zinc-100;
  @apply hover:tw-bg-zinc-100;
}

#map .maplibregl-ctrl-group > button.maplibregl-ctrl-active,
#map .maplibregl-ctrl-group > button.maplibregl-ctrl-active:not(:disabled) {
  @apply tw-bg-blue-500 tw-text-white hover:tw-bg-blue-400 focus-visible:tw-bg-blue-400;
}

#map .maplibregl-ctrl-top-right {
  @apply tw-flex tw-flex-col tw-justify-center tw-inset-y-3;
}

#map .maplibregl-ctrl-attrib {
  font-size: 0.70rem;
  line-height: 1rem;
  margin-left: 6rem;
}

.control-geolocate {
  @apply md:tw-hidden;
}

@media (width >= 768px) {
  #map .maplibregl-ctrl-attrib {
    font-size: 0.8rem;
  }
}
</style>
