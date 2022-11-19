<template>
  <div v-if="geom.type === 'Point'">
    <slot />
    {{ href }}
    <ExternalLink v-if="href" :href="href" target="_blank" v-bind="$attrs">
      yes
      {{ geom.coordinates[1].toFixed(6) }},&nbsp;{{
        geom.coordinates[0].toFixed(6)
      }}
    </ExternalLink>
    <span v-else>
      no
      {{ geom.coordinates[1].toFixed(6) }},&nbsp;{{
        geom.coordinates[0].toFixed(6)
      }}
    </span>
  </div>
</template>

<script lang="ts">
import GeoJSON from 'geojson'
import Vue, { PropType } from 'vue'

import { coordinatesHref } from '~/lib/coordinates'
import { isIOS } from '~/utils/isIOS'

export default Vue.extend({
  props: {
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
  },

  computed: {
    href(): string | undefined {
      return isIOS !== undefined
        ? coordinatesHref(this.geom, isIOS())
        : undefined
    },
  },
})
</script>
