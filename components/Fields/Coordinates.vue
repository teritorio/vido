<script lang="ts">
import type GeoJSON from 'geojson'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import { coordinatesHref } from '~/lib/coordinates'

export function isCoordinatesEmpty(geom: GeoJSON.Geometry): boolean {
  return !(geom && geom.type === 'Point' && geom.coordinates)
}

export default defineNuxtComponent({
  components: {
    ExternalLink,
  },

  props: {
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
  },

  data(): {
    href: string | undefined
  } {
    return { href: undefined }
  },

  mounted() {
    this.href = coordinatesHref(this.geom)
  },
})
</script>

<template>
  <div v-if="geom.type === 'Point'">
    <slot />
    <ExternalLink v-if="href" :href="href" target="_blank">
      {{ geom.coordinates[1].toFixed(6) }},&nbsp;{{
        geom.coordinates[0].toFixed(6)
      }}
    </ExternalLink>
    <span v-else>
      {{ geom.coordinates[1].toFixed(6) }},&nbsp;{{
        geom.coordinates[0].toFixed(6)
      }}
    </span>
  </div>
</template>
