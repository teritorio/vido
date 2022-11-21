<template>
  <div
    ref="container"
    class="maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group"
  >
    <template v-for="background in backgrounds">
      <button
        v-if="!hidden"
        :id="`background-selector-map-${background}`"
        :key="background"
        :aria-label="$tc('mapControls.backgroundAriaLabel')"
        :class="[activeBackground == background && 'maplibregl-ctrl-active']"
        :title="
          $t('mapControls.backgroundButton', {
            background: name(background),
          })
        "
        type="button"
        @click="changeBackground(background)"
      >
        <div class="h-full p-1">
          <img
            class="rounded-full bg-white"
            alt="fond de carte"
            :src="require(`~/assets/${background}.png`)"
          />
        </div>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { Control } from '@teritorio/map'
import { Map } from 'maplibre-gl'
import Vue, { PropType, VueConstructor } from 'vue'

import { DEFAULT_MAP_STYLE, MAP_STYLE_NAMES } from '~/lib/constants'
import { MapStyleEnum } from '~/utils/types'
import { getHashPart, routerPushHashUpdate } from '~/utils/url'

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

  data(): {
    activeBackground: MapStyleEnum | null
  } {
    return {
      activeBackground: null,
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

        const control = new BackgroundControl(this.$refs.container)
        this.map.addControl(control)
      }
    },
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
