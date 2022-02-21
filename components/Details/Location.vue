<template>
  <div
    v-if="p['addr:street'] || p['addr:postcode'] || p['addr:city']"
    id="location"
    class="detail-left-block"
  >
    <h2>{{ $tc('details.headerLocation') }}</h2>
    <p v-if="p.name">{{ p.name }}</p>
    <p>
      {{ p['addr:street'] }}
      {{ p['addr:postcode'] }}
      {{ p['addr:city'] }}
    </p>

    <p v-if="geom.type === 'Point'">
      <span>{{ $tc('details.location') }}</span>
      {{ geom.coordinates[1] }},&nbsp;{{ geom.coordinates[0] }}
    </p>
  </div>
</template>

<script lang="ts">
import GeoJSON from 'geojson'
import Vue, { PropType } from 'vue'

import { ApiPoiProperties } from '@/lib/apiPois'

export default Vue.extend({
  props: {
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
    p: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/details.scss';

#location {
  display: block;
  width: 100%;
  font-size: 0.9rem;

  p {
    margin-bottom: 0.5rem;
    @extend .font-ubuntu-bold;
  }
}
</style>
