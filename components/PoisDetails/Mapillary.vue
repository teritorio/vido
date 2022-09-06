<template>
  <div>
    <iframe
      href=""
      :src="`https://www.mapillary.com/embed?image_key=${imageId}&style=photo`"
    />
    <ExternalLink
      :href="`https://www.mapillary.com/app/?pKey=${imageId}&focus=photo`"
      target="_blank"
    >
      {{ $tc('poiDetails.mapillaryExplore') }}
    </ExternalLink>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import ExternalLink from '~/components/UI/ExternalLink.vue'

export default Vue.extend({
  components: {
    ExternalLink,
  },
  props: {
    imageId: {
      type: String,
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
