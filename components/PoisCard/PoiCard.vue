<template>
  <div
    :id="`PoiCard-${id}`"
    :class="[
      'poiDescription',
      'tw-z-10 tw-flex tw-flex-col tw-w-full md:tw-max-w-xl tw-mx-0 tw-overflow-y-auto tw-shadow-md tw-pointer-events-auto md:tw-flex-row md:tw-w-auto md:tw-mx-auto md:tw-rounded-xl tw-bg-white',
    ]"
  >
    <div
      v-if="showImage"
      class="md:tw-w-48 tw-h-44 md:tw-h-auto md:tw-max-h-full tw-bg-gray-100 tw-text-gray-100 tw-flex tw-items-center tw-align-middle tw-justify-center tw-relative tw-min-icon-height"
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
        class="tw-object-cover tw-h-44 tw-w-full md:tw-w-48 md:tw-h-full tw-z-10"
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

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import PoiCardContent from '~/components/PoisCard/PoiCardContent.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import UIPicture from '~/components/UI/UIPicture.vue'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'

export default defineNuxtComponent({
  components: {
    PoiCardContent,
    TeritorioIcon,
    UIPicture,
  },

  props: {
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

<style scoped>
:deep(img) {
  @apply tw-object-cover tw-w-full tw-h-full;
}

.min-icon-height {
  min-height: 8rem;
}
</style>
