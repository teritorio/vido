<template>
  <div>
    <div v-for="background in backgrounds" :key="background" class="w-11 h-11">
      <button
        v-if="!hidden"
        id="background-selector-map"
        aria-label="$tc('mapControls.backgroundAriaLabel')"
        :class="[
          'bg-white border-4 rounded-full shadow-md outline-none w-11 h-11 focus:outline-none ',
          activeBackground == background && 'border-blue-500',
          activeBackground != background &&
            'border-white hover:border-zinc-100',
        ]"
        :title="
          $t('mapControls.backgroundButton', {
            background: name(background),
          })
        "
        type="button"
        @click="changeBackground(background)"
      >
        <img
          class="h-full rounded-full"
          alt="fond de carte"
          :src="require(`~/assets/${background}.png`)"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { DEFAULT_MAP_STYLE, MAP_STYLE_NAMES } from '~/lib/constants'
import { MapStyleEnum } from '~/utils/types'
import { getHashPart, routerPushHashUpdate } from '~/utils/url'

export default Vue.extend({
  props: {
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

  mounted() {
    const bgString = getHashPart(this.$router, 'bg')
    const bg = MapStyleEnum[bgString as keyof typeof MapStyleEnum]
    if (bg && this.backgrounds.includes(bg)) {
      this.activeBackground = bg
    } else {
      this.activeBackground = this.initialBackground
    }
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
      this.$emit('changeBackground', background)
    },
  },
})
</script>
