<template>
  <Block
    v-if="p['route:gpx_trace']"
    :color-fill="colorFill"
    icon="arrow-circle-down"
  >
    <h2>{{ $tc('poiDetails.headerDownload') }}</h2>
    <p v-if="p['route:gpx_trace']" class="item">
      <a :href="p['route:gpx_trace']">
        <font-awesome-icon prefix="fa" icon="arrow-circle-down" />
        {{ $tc('poiDetails.downloadGPX') }}
      </a>
    </p>
    <p v-if="p['route:pdf']" class="item">
      <a :href="p['route:pdf']">
        <font-awesome-icon prefix="fa" icon="file-pdf" />
        {{ $tc('poiDetails.downloadPDF') }}
      </a>
    </p>
  </Block>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Block from '~/components/PoisDetails/Block.vue'
import { ApiPoiProperties } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    Block,
  },

  props: {
    p: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    colorFill: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="css" scoped>
.item {
  font-size: 1rem;
  margin-bottom: 0.27rem;
}
</style>
