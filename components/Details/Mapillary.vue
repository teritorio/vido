<template>
  <div>
    <iframe
      href=""
      :src="`https://www.mapillary.com/embed?image_key=${imageId}&style=photo`"
    />
    <a
      :href="`https://www.mapillary.com/app/?pKey=${imageId}&focus=photo`"
      targer="_blank"
    >
      {{ $tc('details.mapillaryExplore') }}
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    imageId: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/details.scss';

div {
  margin-bottom: 60px;
}

iframe {
  width: 100%;
  height: 346px;
}
</style>
