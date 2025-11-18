<script setup lang="ts">
import { VCarousel, VCarouselItem } from 'vuetify/components/VCarousel'
import UIPicture from '~/components/UI/UIPicture.vue'

defineProps<{
  images: string[]
}>()

const { t } = useI18n()
</script>

<template>
  <div v-if="images.length === 1" class="tw-margin tw-slide tw-mb-14">
    <UIPicture
      sizes="sm:768px"
      :src="images[0]"
      :alt="t('poiCard.image')"
    />
  </div>
  <div v-else-if="images.length > 1">
    <VCarousel
      :show-arrows="false"
      :hide-delimiter-background="true"
      class="tw-mb-14 print:tw-mb-6"
      height="auto"
    >
      <VCarouselItem v-for="(image, i) in images" :key="i">
        <UIPicture
          sizes="sm:768px"
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
