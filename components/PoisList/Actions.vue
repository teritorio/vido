<template>
  <ul>
    <li>
      <IconButton
        :aria-label="$tc('poisTable.showOnMap')"
        class="w-8 h-8"
        :href="urlMap"
        target="_blank"
      >
        <font-awesome-icon icon="map" :style="{ color: colorLine }" />
      </IconButton>
    </li>
    <li>
      <IconButton
        :aria-label="$tc('poisTable.downloadCsv')"
        class="w-8 h-8"
        :href="urlCsv"
      >
        <font-awesome-icon icon="file-csv" :style="{ color: colorLine }" />
      </IconButton>
    </li>
    <li>
      <IconButton
        :aria-label="$tc('poisTable.downloadGeojson')"
        class="w-8 h-8"
        :href="urlGeojson"
      >
        <font-awesome-icon
          icon="map-marker-alt"
          :style="{ color: colorLine }"
        />
      </IconButton>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

import IconButton from '~/components/UI/IconButton.vue'
import { getPoiByCategoryIdUrl } from '~/lib/apiPois'

export default Vue.extend({
  components: {
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
        this.$route.params.id,
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

<style lang="scss" scoped>
@import '~/assets/details.scss';

ul {
  position: relative;
  display: block;
  width: 100%;
  text-align: right;
  margin-bottom: 0.6rem;
  list-style: none;

  li {
    display: inline-block;
    margin: 0.3rem;
    border-radius: 50%;
  }
}

@media (max-width: 991px) {
  ul {
    text-align: center;
  }
}
</style>
