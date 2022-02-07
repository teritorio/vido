<template>
  <div
    v-if="p['addr:street'] || p['addr:postcode'] || p['addr:city']"
    id="location"
    class="detail-left-block"
  >
    <h2>Localisation &amp; Adresse</h2>
    <p v-if="p.name">{{ p.name }}</p>
    <p>
      {{ p['addr:street'] }}
      {{ p['addr:postcode'] }}
      {{ p['addr:city'] }}
    </p>

    <p v-if="geom.type === 'Point'">
      <span>Coordonnées GPS (Lat, Lon)&nbsp;:</span>
      {{ geom.coordinates[1] }},&nbsp;{{ geom.coordinates[0] }}
    </p>
  </div>
</template>

<script lang="ts">
import GeoJSON from 'geojson'
import Vue, { PropType } from 'vue'

import { VidoFeatureProperties } from '~/utils/types'

export default Vue.extend({
  props: {
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
    p: {
      type: Object as PropType<VidoFeatureProperties>,
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
    font-family: $font-ubuntu-bold;
  }
}
</style>
