<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import PoiCardContent from '~/components/PoisCard/PoiCardContent.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import UIButton from '~/components/UI/UIButton.vue'
import UIPicture from '~/components/UI/UIPicture.vue'
import type { ApiPoi, ApiPoiId } from '~/lib/apiPois'
import useDevice from '~/composables/useDevice'

export default defineNuxtComponent({
  components: {
    PoiCardContent,
    TeritorioIcon,
    UIButton,
    UIPicture,
  },

  props: {
    canClose: {
      type: Boolean,
      default: true,
    },
    poi: {
      type: Object as PropType<ApiPoi>,
      required: true,
    },
    explorerModeEnabled: {
      type: Boolean,
      required: true,
    },
    favoritesModeEnabled: {
      type: Boolean,
      required: true,
    },
    showImage: {
      type: Boolean,
      default: true,
    },
  },

  setup() {
    const device = useDevice()

    return {
      device,
    }
  },

  computed: {
    id(): ApiPoiId {
      return this.poi.properties.metadata.id
    },

    colorFill(): string {
      return this.poi.properties.display?.color_fill || 'black'
    },

    icon(): string | undefined {
      return this.poi.properties.display?.icon
    },
  },
})
</script>

<template>
  <div
    :id="`PoiCard-${id}`"
    class="poiDescription tw-z-10 tw-flex tw-flex-col tw-w-full md:tw-max-w-xl tw-mx-0 tw-overflow-y-auto tw-shadow-md tw-pointer-events-auto md:tw-flex-row md:tw-w-auto md:tw-mx-auto md:tw-rounded-xl tw-bg-white"
  >
    <UIButton
      v-show="canClose"
      id="close-poi-card"
      :color="device.smallScreen ? '#ffffff' : '#000000'"
      :style="{ backgroundColor: device.smallScreen ? 'rgb(0 0 0 / 55%)' : 'transparent' }"
      :title="$t('ui.close')"
      icon="times"
      @click="$emit('onClose')"
    />
    <div
      v-if="showImage"
      class=" tw-bg-gray-100 tw-text-gray-100 tw-flex tw-relative tw-items-center tw-align-middle tw-justify-center tw-h-44 md:tw-w-48 md:tw-h-auto md:tw-max-h-full min-icon-height"
    >
      <TeritorioIcon
        v-if="icon"
        :picto="icon"
        :use-native-alignment="false"
        class="tw-text-8xl tw-align-middle tw-absolute tw-z-0"
        :color-text="
          poi.properties.image && poi.properties.image.length > 0
            ? '#AAA'
            : colorFill
        "
      />
      <UIPicture
        v-if="poi.properties.image && poi.properties.image.length > 0"
        class="tw-object-cover tw-h-full tw-w-full tw-z-10"
        :src="poi.properties.image[0]"
        :alt="$t('poiCard.thumbnail')"
        media-size="30rem"
      />
    </div>

    <PoiCardContent
      :poi="poi"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="favoritesModeEnabled"
      class="tw-px-4 tw-py-5 tw-flex tw-flex-col md:tw-overflow-y-auto tw-flex-grow md:tw-max-h-full tw-box-border tw-w-full md:tw-h-80 md:tw-w-96"
      v-bind="$attrs"
    />
  </div>
</template>

<style scoped>
.poiDescription {
  position: relative;
}

:deep(img) {
  @apply tw-object-cover tw-w-full tw-h-full;
}

#close-poi-card {
  border: 0;
  border-radius: 0 0 0 8px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 15;
}

#close-poi-card :deep(svg) {
  width: 24px;
  height: 24px;
}

.min-icon-height {
  min-height: 11rem;
}
</style>
