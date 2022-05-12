<template>
  <div class="w-11 h-11">
    <button
      v-if="!hidden"
      id="background-selector-map"
      aria-label="$tc('mapControls.backgroundAriaLabel')"
      class="bg-zinc-100 border-4 border-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100"
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

import { DEFAULT_MAP_STYLE } from '@/lib/constants'
import { getHashPart, routerPushHashUpdate } from '@/utils/url'

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
    if (
      getHashPart(this.$router, 'bg') &&
      this.backgrounds[getHashPart(this.$router, 'bg') || '']
    ) {
      this.background = getHashPart(this.$router, 'bg')
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
      routerPushHashUpdate(this.$router, {
        bg:
          nextBackgroundName !== DEFAULT_MAP_STYLE ? nextBackgroundName : null,
      })
      this.$emit('changeBackground', nextBackgroundName)
    },

    nextBackgroundName(backgroundNameReference: string): string {
      const styleNames = [
        'vector',
        'aerial',
        ...(!this.$screen.smallScreen ? ['raster'] : []),
      ]

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
