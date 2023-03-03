<template>
  <div>
    <iframe
      :src="`https://www.mapillary.com/embed?image_key=${imageId}&x=0.5&y=0.5&style=photo`"
    />
    <ExternalLink
      :href="`https://www.mapillary.com/app/?pKey=${imageId}&focus=photo`"
      target="_blank"
    >
      {{ $t('poiDetails.mapillaryExplore') }}
    </ExternalLink>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import ExternalLink from '~/components/UI/ExternalLink.vue'

export default defineComponent({
  components: {
    ExternalLink,
  },
  props: {
    imageId: {
      type: String as PropType<string>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/details.scss';

div {
  margin-bottom: 60px;
}

iframe {
  width: 100%;
  height: 346px;
  @apply bg-gray-100;
}
</style>
