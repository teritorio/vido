<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import { getPoiByCategoryIdUrl } from '~/lib/apiPois'

const props = defineProps<{
  categoryId: number
  colorLine: string
}>()

const urlMap = computed((): string => `/${props.categoryId}/`)

const urlCsv = computed((): string => url('csv'))

const urlGeojson = computed((): string => url('geojson'))

const route = useRoute()
function url(format: 'geojson' | 'csv'): string {
  const query = {
    geometry_as: 'point',
    short_description: false,
    format,
  } as Record<string, any>

  if (route.query.clipingPolygonSlug)
    query.cliping_polygon_slug = route.query.clipingPolygonSlug.toString()

  return getPoiByCategoryIdUrl(props.categoryId, query)
}
</script>

<template>
  <IconsBar>
    <IconButton
      :label="$t('poisTable.showOnMap')"
      class="tw-w-8 tw-h-8"
      :href="urlMap"
      target="_blank"
    >
      <FontAwesomeIcon icon="map" :style="{ color: colorLine }" />
    </IconButton>
    <IconButton
      :label="$t('poisTable.downloadCsv')"
      class="tw-w-8 tw-h-8"
      :href="urlCsv"
    >
      <FontAwesomeIcon icon="file-csv" :style="{ color: colorLine }" />
    </IconButton>
    <IconButton
      :label="$t('poisTable.downloadGeojson')"
      class="tw-w-8 tw-h-8"
      :href="urlGeojson"
    >
      <FontAwesomeIcon icon="map-marker-alt" :style="{ color: colorLine }" />
    </IconButton>
  </IconsBar>
</template>
