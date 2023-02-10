<template>
  <IconsBar>
    <IconButton
      :aria-label="$tc('poisTable.showOnMap')"
      class="w-8 h-8"
      :href="urlMap"
      target="_blank"
    >
      <font-awesome-icon icon="map" :style="{ color: colorLine }" />
    </IconButton>
    <IconButton
      :aria-label="$tc('poisTable.downloadCsv')"
      class="w-8 h-8"
      :href="urlCsv"
    >
      <font-awesome-icon icon="file-csv" :style="{ color: colorLine }" />
    </IconButton>
    <IconButton
      :aria-label="$tc('poisTable.downloadGeojson')"
      class="w-8 h-8"
      :href="urlGeojson"
    >
      <font-awesome-icon icon="map-marker-alt" :style="{ color: colorLine }" />
    </IconButton>
  </IconsBar>
</template>

<script lang="ts">
import Vue from 'vue'

import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import { getPoiByCategoryIdUrl } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    IconsBar,
    IconButton,
  },

  props: {
    categoryId: {
      type: Number,
      required: true,
    },
    colorLine: {
      type: String,
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
      return getPoiByCategoryIdUrl(
        this.$vidoConfig().API_ENDPOINT,
        this.$vidoConfig().API_PROJECT,
        this.$vidoConfig().API_THEME,
        this.categoryId,
        {
          geometry_as: 'point',
          short_description: false,
          format: format,
        }
      )
    },
  },
})
</script>
