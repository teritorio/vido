<template>
  <div class="flex flex-col h-screen">
    <CategorySelector
      :menu-items="menuItems"
      :category-id="categoryId"
      @category-change="onMenuChange"
    />
    <div class="flex flex-grow">
      <MapFeatures
        ref="mapFeatures"
        :default-bounds="settings.bbox_line.coordinates"
        :fit-bounds-padding-options="fitBoundsPaddingOptions"
        :extra-attributions="settings.attributions"
        :categories="menuItems"
        :features="features"
        :selected-categories-ids="[categoryId]"
        :style-icon-filter="null"
        :explorer-mode-enabled="explorerModeEnabled"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { FitBoundsOptions } from 'maplibre-gl'
import Vue, { PropType } from 'vue'

import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { ApiPoi, getPoiByCategoryId } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'

export default Vue.extend({
  components: {
    CategorySelector,
    MapFeatures,
  },

  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
  },

  data(): {
    categoryId: number | undefined
    features: ApiPoi[]
  } {
    return {
      categoryId: undefined,
      features: [],
    }
  },

  computed: {
    menuItems(): Record<ApiMenuCategory['id'], MenuItem> {
      return this.$store.getters['menu/menuItems']
    },

    fitBoundsPaddingOptions(): FitBoundsOptions['padding'] {
      return {
        top: 100,
        bottom: 100,
        right: 100,
        left: 100,
      }
    },

    explorerModeEnabled(): boolean {
      return this.settings.themes[0]?.explorer_mode ?? true
    },
  },

  watch: {
    categoryId() {
      this.features = []

      if (this.categoryId) {
        getPoiByCategoryId(
          this.$vidoConfig().API_ENDPOINT,
          this.$vidoConfig().API_PROJECT,
          this.$vidoConfig().API_THEME,
          this.categoryId,
          {
            geometry_as: 'point',
            short_description: true,
          }
        ).then((pois) => {
          this.features = pois.features
        })
      }
    },
  },

  methods: {
    onMenuChange(newCategoryId: number) {
      this.categoryId = newCategoryId
    },
  },
})
</script>
