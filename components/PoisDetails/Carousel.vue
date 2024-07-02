<script lang="ts">
import type { PropType } from 'vue'
import { VCarousel, VCarouselItem } from 'vuetify/components/VCarousel'

import { defineNuxtComponent } from '#app'
import UIPicture from '~/components/UI/UIPicture.vue'
import useDevice from '~/composables/useDevice'

export default defineNuxtComponent({
  components: {
    UIPicture,
    VCarousel,
    VCarouselItem,
  },

  setup() {
    const device = useDevice()

    return {
      device,
    }
  },

  props: {
    images: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
})
</script>

<template>
  <div v-if="images.length === 1" class="tw-margin tw-slide tw-mb-14">
    <UIPicture
      :src="images[0]"
      :media-size="device.smallScreen ? '100vw' : '66vw'"
      :alt="$t('poiCard.image')"
    />
  </div>
  <div v-else-if="images.length > 1">
    <v-carousel
      :show-arrows="false"
      :hide-delimiter-background="true"
      class="tw-mb-14 print:tw-mb-6"
      height="auto"
    >
      <v-carousel-item v-for="(image, i) in images" :key="i">
        <UIPicture
          :src="image"
          :media-size="device.smallScreen ? '100vw' : '66vw'"
          :alt="$t('poiCard.image')"
        />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-carousel__controls > button svg) {
  color: #000;
  border: 2px solid #fff;
  border-radius: 100%;
}

:deep(picture img) {
  aspect-ratio: 16/9;
  object-fit: cover;
  height: auto;
  width: 100%;
}
</style>
