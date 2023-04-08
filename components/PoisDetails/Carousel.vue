<template>
  <div v-if="images.length == 1" class="tw-margin tw-slide tw-mb-14">
    <UIPicture :src="images[0]" media-size="66vw" :alt="$t('poiCard.image')" />
  </div>
  <div v-else-if="images.length > 1">
    <v-carousel
      :show-arrows="false"
      :hide-delimiter-background="true"
      class="mb-14"
    >
      <v-carousel-item v-for="(image, i) in images" :key="i">
        <UIPicture
          :src="image"
          media-size="66vw"
          :alt="$t('poiCard.image')"
          :img-attrs="{ class: 'h-100 tw-object-cover' }"
        />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { VCarousel, VCarouselItem } from 'vuetify/components/VCarousel'

import { defineNuxtComponent } from '#app'
import UIPicture from '~/components/UI/UIPicture.vue'

export default defineNuxtComponent({
  components: {
    UIPicture,
    VCarousel,
    VCarouselItem,
  },

  props: {
    images: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
})
</script>
