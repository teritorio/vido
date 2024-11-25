<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import { getPoiByCategoryIdUrl } from '~/lib/apiPois'
import { siteStore as useSiteStore } from '~/stores/site'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    IconsBar,
    IconButton,
  },
  props: {
    categoryId: {
      type: Number,
      required: true,
    },
    colorLine: {
      type: String as PropType<string>,
      required: true,
    },
  },

  computed: {
    urlMap(): string {
      return `/${this.categoryId}/`
    },

    urlCsv(): string {
      return this.url('csv')
    },

    urlGeojson(): string {
      return this.url('geojson')
    },
  },

  methods: {
    url(format: 'geojson' | 'csv'): string {
      const query = {
        geometry_as: 'point',
        short_description: false,
        format,
      } as Record<string, any>

      if (this.$route.query.clipingPolygonSlug)
        query.cliping_polygon_slug = this.$route.query.clipingPolygonSlug.toString()

      return getPoiByCategoryIdUrl(useSiteStore().config!, this.categoryId, query)
    },
  },
})
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
