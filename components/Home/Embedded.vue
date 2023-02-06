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
        :style-icon-filter="poiFilters"
        :explorer-mode-enabled="explorerModeEnabled"
      />
    </div>
    <div class="fixed flex left-8 right-16 bottom-5">
      <PoiCard
        v-if="selectedFeature"
        :poi="selectedFeature"
        class="grow-0"
        :explorer-mode-enabled="explorerModeEnabled"
        :favorites-mode-enabled="favoritesModeEnabled"
        @explore-click="toggleExploreAroundSelectedPoi"
        @favorite-click="toggleFavorite($event)"
        @zoom-click="goToSelectedFeature"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { FitBoundsOptions } from 'maplibre-gl'
import mixins from 'vue-typed-mixins'

import HomeMixin from '~/components/Home/HomeMixin'
import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'
import { ApiPoi, getPoiByCategoryId } from '~/lib/apiPois'
import { Mode } from '~/utils/types'

export default mixins(HomeMixin).extend({
  components: {
    CategorySelector,
    MapFeatures,
    PoiCard,
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
    fitBoundsPaddingOptions(): FitBoundsOptions['padding'] {
      return {
        top: 100,
        bottom: 100,
        right: 100,
        left: 100,
      }
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

    toggleExploreAroundSelectedPoi(feature?: ApiPoi) {
      if (!this.isModeExplorer) {
        this.setMode(Mode.EXPLORER)
        this.goToSelectedFeature()
      } else {
        this.setMode(Mode.BROWSER)
      }
    },
  },
})
</script>
