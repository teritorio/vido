<template>
  <div ref="container" class="maplibregl-ctrl maplibregl-ctrl-group">
    <template v-for="background in backgrounds">
      <button
        v-if="!hidden"
        :id="`background-selector-map-${background}`"
        :key="background"
        :aria-label="$t('mapControls.backgroundAriaLabel')"
        :class="[activeBackground == background && 'maplibregl-ctrl-active']"
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
          />
        </span>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { Control } from '@teritorio/map'
import type { Map } from 'maplibre-gl'
import { PropType, ref } from 'vue'

import { defineNuxtComponent } from '#app'
import { DEFAULT_MAP_STYLE, MAP_STYLE_NAMES } from '~/lib/constants'
import { MapStyleEnum } from '~/utils/types'
import { getHashPart, routerPushHashUpdate } from '~/utils/url'

export default defineNuxtComponent({
  props: {
    map: {
      type: Object as PropType<Map>,
      default: null,
    },
    backgrounds: {
      type: Array as PropType<MapStyleEnum[]>,
      required: true,
    },
    initialBackground: {
      type: String as PropType<MapStyleEnum>,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      container: ref<InstanceType<typeof HTMLDivElement>>(),
    }
  },

  created() {
    this.backgroundImages = Object.fromEntries(
      this.backgrounds.map((background) => {
        const imageUrl = new URL(
          `../../assets/${background}.png`,
          import.meta.url
        ).href
        return [background, imageUrl]
      })
    )
  },

  data(): {
    activeBackground: MapStyleEnum
    backgroundImages: Record<string, string>
  } {
    return {
      activeBackground: this.initialBackground,
      backgroundImages: {},
    }
  },

  watch: {
    map(value, oldValue) {
      if (!oldValue && value) {
        const bgString = getHashPart(this.$router, 'bg')
        const bg = MapStyleEnum[bgString as keyof typeof MapStyleEnum]
        if (bg && this.backgrounds.includes(bg)) {
          this.activeBackground = bg
        } else {
          this.activeBackground = this.initialBackground
        }

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

  emits: {
    'change-background': (background: MapStyleEnum) => true,
  },

  methods: {
    name(background: keyof typeof MapStyleEnum) {
      return MAP_STYLE_NAMES[background]
    },

    changeBackground(background: MapStyleEnum) {
      // TODO mettre le background selectioné
      this.$tracking({ type: 'map_control_event', event: 'background' })

      this.activeBackground = background
      routerPushHashUpdate(this.$router, {
        bg: background !== DEFAULT_MAP_STYLE ? background : null,
      })
      this.$emit('change-background', background)
    },
  },
})
</script>
