<template>
  <div class="flex flex-col h-screen">
    <CategorySelector :menu-items="menuItems" @category-change="onMenuChange" />
    <div class="flex flex-grow">
      <MapFeatures
        ref="mapFeatures"
        :default-bounds="settings.bbox_line.coordinates"
        :fit-bounds-padding-options="fitBoundsPaddingOptions"
        :extra-attributions="settings.attributions"
        :categories="menuItems"
        :features="mapFeatures"
        :selected-categories-ids="selectedCategoryIds"
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
import { mapActions } from 'vuex'

import HomeMixin from '~/components/Home/HomeMixin'
import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import PoiCard from '~/components/PoisCard/PoiCard.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'
import { ApiPoi } from '~/lib/apiPois'
import { Mode } from '~/utils/types'
import { flattenFeatures } from '~/utils/utilities'

export default mixins(HomeMixin).extend({
  components: {
    CategorySelector,
    MapFeatures,
    PoiCard,
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

    mapFeatures(): ApiPoi[] {
      return flattenFeatures(this.$store.getters['menu/features'])
    },
  },

  watch: {
    selectedCategoryIds() {
      if (this.selectedCategoryIds) {
        this.$store.dispatch('menu/fetchFeatures', {
          apiEndpoint: this.$vidoConfig().API_ENDPOINT,
          apiProject: this.$vidoConfig().API_PROJECT,
          apiTheme: this.$vidoConfig().API_THEME,
          categoryIds: this.selectedCategoryIds,
        })
      }
    },
  },

  methods: {
    ...mapActions({
      addSelectedCategoryIds: 'menu/addSelectedCategoryIds',
    }),

    onMenuChange(newCategoryId: number) {
      this.addSelectedCategoryIds([newCategoryId])
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
