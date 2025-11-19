<script setup lang="ts">
import { VCarousel, VCarouselItem } from 'vuetify/components/VCarousel'
import UIPicture from '~/components/UI/UIPicture.vue'

defineProps<{
  images: string[]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="carousel">
    <UIPicture
      v-if="images.length === 1" class="tw-margin tw-slide"
      sizes="768px"
      :src="images[0]"
      :alt="t('poiCard.image')"
    />

    <VCarousel
      v-else
      :show-arrows="false"
      :hide-delimiter-background="true"
      height="auto"
    >
      <VCarouselItem v-for="(image, i) in images" :key="i">
        <UIPicture
          sizes="768px"
          :src="image"
          :alt="t('poiCard.image')"
        />
      </VCarouselItem>
    </VCarousel>
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
