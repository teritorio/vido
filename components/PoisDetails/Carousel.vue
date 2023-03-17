<template>
  <div v-if="images.length == 1" class="tw-margin tw-slide tw-mb-14">
    <NuxtPicture
      :src="images[0]"
      media-size="66vw"
      :alt="$t('poiCard.image')"
    />
  </div>
  <div v-else-if="images.length > 1">
    <v-carousel :show-arrows="false" class="mb-14">
      <v-carousel-item v-for="(image, i) in images" :key="i">
        <NuxtPicturePatch
          :src="image"
          media-size="66vw"
          :alt="$t('poiCard.image')"
          class="h-100"
        />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { VCarousel, VCarouselItem } from 'vuetify/components/VCarousel'

import { defineNuxtComponent } from '#app'
import NuxtPicturePatch from '~/components/UI/NuxtPicture.vue'

export default defineNuxtComponent({
  components: {
    NuxtPicturePatch,
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
