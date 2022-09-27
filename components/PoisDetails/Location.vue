<template>
  <div
    v-if="p['addr:street'] || p['addr:postcode'] || p['addr:city']"
    id="location"
    class="detail-left-block"
  >
    <h2>{{ $tc('poiDetails.headerLocation') }}</h2>
    <p v-if="p.name">{{ p.name }}</p>
    <p>
      <AddressField :properties="p"></AddressField>
    </p>

    <p v-if="geom.type === 'Point'">
      <span>{{ $tc('poiDetails.location') }}</span>
      <Coordinates :geom="geom" />
    </p>
  </div>
</template>

<script lang="ts">
import GeoJSON from 'geojson'
import Vue, { PropType } from 'vue'

import Coordinates from '../Fields/Coordinates.vue'

import AddressField from '~/components/Fields/AddressField.vue'
import { ApiPoiProperties } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    AddressField,
    Coordinates,
  },

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
@import '~/assets/details.scss';

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
