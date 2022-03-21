<template>
  <div class="w-11 h-11">
    <button
      v-if="!hidden"
      id="background-selector-map"
      aria-label="$tc('mapControls.backgroundAriaLabel')"
      class="bg-gray-100 border-4 border-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
      :title="
        $t('mapControls.backgroundButton', {
          current: backgrounds[background],
        })
      "
      type="button"
      @click="displayNextBackground"
    >
      <img
        class="h-full rounded-full"
        alt="fond de carte"
        :src="require(`~/assets/${nextBackgroundName(background)}.png`)"
      />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { getHashPart, setHashPart } from '@/utils/url'

export default Vue.extend({
  props: {
    backgrounds: {
      type: Object,
      default: null,
    },
    initialBackground: {
      type: String,
      default: null,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },

  data(): {
    background: string | null
  } {
    return {
      background: null,
    }
  },

  mounted() {
    if (getHashPart('bg') && this.backgrounds[getHashPart('bg') || '']) {
      this.background = getHashPart('bg')
    } else if (this.initialBackground) {
      this.background = this.initialBackground
    } else {
      this.displayNextBackground()
    }
  },

  methods: {
    displayNextBackground() {
      this.$tracking({ type: 'map_control_event', event: 'background' })
      if (!this.background) {
        return
      }

      const nextBackgroundName = this.nextBackgroundName(this.background)
      this.background = nextBackgroundName
      setHashPart('bg', nextBackgroundName)
      this.$emit('changeBackground', nextBackgroundName)
    },

    nextBackgroundName(backgroundNameReference: string): string {
      const styleNames = ['vector', 'aerial', 'raster']

      const backgroundReferenceIndex = styleNames.findIndex(
        (styleName) => styleName === backgroundNameReference
      )
      const styleIndex =
        backgroundReferenceIndex + 1 > styleNames.length - 1
          ? 0
          : backgroundReferenceIndex + 1

      return styleNames[styleIndex]
    },
  },
})
</script>
