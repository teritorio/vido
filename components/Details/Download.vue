<template>
  <Block
    v-if="p['route:gpx_trace']"
    :color-fill="colorFill"
    image-url="url('data:image/png;base64,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')"
  >
    <h2>{{ $tc('details.headerDownload') }}</h2>
    <p v-if="p['route:gpx_trace']" class="item">
      <a :href="p['route:gpx_trace']">
        <font-awesome-icon prefix="fa" icon="arrow-circle-down" />
        {{ $tc('details.downloadGPX') }}
      </a>
    </p>
  </Block>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Block from '@/components/Details/Block.vue'
import { ApiPoiProperties } from '@/lib/apiPois'

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
