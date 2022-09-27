<template>
  <CoordinateAction v-if="geom.type === 'Point'" :geometry="geom">
    {{ geom.coordinates[1] }},&nbsp;{{ geom.coordinates[0] }}
  </CoordinateAction>
</template>

<script lang="ts">
import GeoJSON from 'geojson'
import Vue, { PropType } from 'vue'

import CoordinateAction from '../Fields/CoordinateAction.vue'

export default Vue.extend({
  components: {
    CoordinateAction,
  },

  props: {
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
  },
})
</script>
