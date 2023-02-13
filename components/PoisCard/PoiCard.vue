<template>
  <div
    :id="`PoiCard-${id}`"
    :class="[
      'poiDescription',
      'z-10 flex flex-col w-full md:max-w-xl mx-0 overflow-y-auto shadow-md pointer-events-auto md:flex-row md:w-auto md:mx-auto md:rounded-xl bg-white',
    ]"
  >
    <div
      v-if="showImage"
      class="md:w-48 h-44 md:h-auto md:max-h-full bg-gray-100 flex items-center align-middle justify-center relative min-icon-height"
    >
      <TeritorioIcon
        v-if="icon"
        :picto="icon"
        :use-native-alignment="false"
        class="text-8xl align-middle absolute z-0"
        :color-text="
          poi.properties.image && poi.properties.image.length > 0
            ? '#AAA'
            : colorFill
        "
      />
      <NuxtPicture
        v-if="poi.properties.image && poi.properties.image.length > 0"
        class="object-cover h-44 w-full md:w-48 md:h-full z-10"
        :src="poi.properties.image[0]"
        :alt="$t('poiCard.thumbnail')"
        media-size="30rem"
      />
    </div>

    <PoiCardContent
      :poi="poi"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="favoritesModeEnabled"
      class="px-4 py-5 flex flex-col md:overflow-y-auto flex-grow h-auto md:max-h-full box-border w-full md:h-80 md:w-96"
      v-on="$listeners"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import PoiCardContent from '~/components/PoisCard/PoiCardContent.vue'
import NuxtPicture from '~/components/UI/NuxtPicture.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    PoiCardContent,
    TeritorioIcon,
    NuxtPicture,
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
  @apply object-cover w-full h-full;
}

.min-icon-height {
  min-height: 8rem;
}
</style>
