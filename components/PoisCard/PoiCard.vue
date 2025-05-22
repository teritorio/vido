<script setup lang="ts">
import PoiCardContent from '~/components/PoisCard/PoiCardContent.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import UIButton from '~/components/UI/UIButton.vue'
import UIPicture from '~/components/UI/UIPicture.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { getContrastedColors } from '~/composables/useFeature'

const props = withDefaults(defineProps<{
  canClose?: boolean
  poi: ApiPoi
  showImage?: boolean
}>(), {
  canClose: true,
  showImage: true,
})

const emit = defineEmits<{
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'onClose'): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()

const device = useDevice()
const { colorFill } = getContrastedColors(props.poi.properties.display?.color_fill)

const closeBtnStyles = reactive({
  backgroundColor: 'rgb(0 0 0 / 55%)',
  borderRadius: device.value.smallScreen ? '0 0 0 8px' : '0 0 8px 0',
  right: device.value.smallScreen ? 0 : 'unset',
  left: device.value.smallScreen ? 'unset' : 0,
})
</script>

<template>
  <div
    :id="`PoiCard-${poi.properties.metadata.id}`"
    class="poiDescription tw-z-10 tw-flex tw-flex-col tw-w-full md:tw-max-w-xl tw-mx-0 tw-overflow-y-auto tw-shadow-md tw-pointer-events-auto md:tw-flex-row md:tw-w-auto md:tw-mx-auto md:tw-rounded-xl tw-bg-white"
  >
    <UIButton
      v-show="canClose"
      id="close-poi-card"
      color="#ffffff"
      :style="closeBtnStyles"
      :title="$t('ui.close')"
      icon="times"
      @click="emit('onClose')"
    />
    <div
      v-if="showImage"
      class=" tw-bg-gray-100 tw-text-gray-100 tw-flex tw-relative tw-items-center tw-align-middle tw-justify-center tw-h-44 md:tw-w-48 md:tw-h-auto md:tw-max-h-full min-icon-height"
    >
      <TeritorioIcon
        v-if="poi.properties.display?.icon"
        :picto="poi.properties.display.icon"
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
      class="tw-px-4 tw-py-5 tw-flex tw-flex-col md:tw-overflow-y-auto tw-flex-grow md:tw-max-h-full tw-box-border tw-w-full md:tw-h-80 md:tw-w-96"
      @explore-click="emit('exploreClick', $event)"
      @favorite-click="emit('favoriteClick', $event)"
      @zoom-click="emit('zoomClick', $event)"
    />
  </div>
</template>

<style lang="css" scoped>
.poiDescription {
  position: relative;
}

:deep(img) {
  @apply tw-object-cover tw-w-full tw-h-full;
}

#close-poi-card {
  border: 0;
  position: absolute;
  top: 0;
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
