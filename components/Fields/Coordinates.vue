<script setup lang="ts">
import type GeoJSON from 'geojson'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import { coordinatesHref } from '~/lib/coordinates'

const props = defineProps<{
  geom: GeoJSON.Geometry
}>()

const href = ref<string>()

onMounted(() => {
  href.value = coordinatesHref(props.geom)
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
