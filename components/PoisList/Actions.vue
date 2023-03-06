<template>
  <IconsBar>
    <IconButton
      :label="$t('poisTable.showOnMap')"
      class="w-8 h-8"
      :href="urlMap"
      target="_blank"
    >
      <font-awesome-icon icon="map" :style="{ color: colorLine }" />
    </IconButton>
    <IconButton
      :label="$t('poisTable.downloadCsv')"
      class="w-8 h-8"
      :href="urlCsv"
    >
      <font-awesome-icon icon="file-csv" :style="{ color: colorLine }" />
    </IconButton>
    <IconButton
      :label="$t('poisTable.downloadGeojson')"
      class="w-8 h-8"
      :href="urlGeojson"
    >
      <font-awesome-icon icon="map-marker-alt" :style="{ color: colorLine }" />
    </IconButton>
  </IconsBar>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { useNuxtApp } from '#app'
import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import { getPoiByCategoryIdUrl } from '~/lib/apiPois'

export default defineComponent({
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
      const { $vidoConfig } = useNuxtApp()
      return getPoiByCategoryIdUrl(
        $vidoConfig().API_ENDPOINT,
        $vidoConfig().API_PROJECT,
        $vidoConfig().API_THEME,
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
