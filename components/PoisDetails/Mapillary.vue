<script setup lang="ts">
import ExternalLink from '~/components/UI/ExternalLink.vue'

defineProps<{
  imageId: string
}>()

const { t } = useI18n()
</script>

<template>
  <div>
    <iframe :src="`https://www.mapillary.com/embed?image_key=${imageId}&x=0.5&y=0.5&style=photo`" />
    <ExternalLink
      :href="`https://www.mapillary.com/app/?pKey=${imageId}&focus=photo`"
      target="_blank"
    >
      {{ t('poiDetails.mapillaryExplore') }}
    </ExternalLink>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/details';

iframe {
  width: 100%;
  height: 346px;

  @apply tw-bg-gray-100;
}
</style>
