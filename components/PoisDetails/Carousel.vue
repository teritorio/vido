<template>
  <div v-if="images.length == 1" class="margin slide mb-14">
    <NuxtPicture
      :src="images[0]"
      media-size="66vw"
      :alt="$t('poiCard.image')"
    />
  </div>
  <v-carousel v-else-if="images.length > 1" :show-arrows="false" class="mb-14">
    <v-carousel-item v-for="(image, i) in images" :key="i">
      <NuxtPicture
        :key="i"
        :src="image"
        media-size="66vw"
        :alt="$t('poiCard.image')"
      />
    </v-carousel-item>
  </v-carousel>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { VCarousel, VCarouselItem } from 'vuetify/components/VCarousel'

import { defineNuxtComponent } from '#app'
import NuxtPicture from '~/components/UI/NuxtPicture.vue'

export default defineNuxtComponent({
  components: {
    NuxtPicture,
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
