<template>
  <div class="flex flex-col h-screen">
    <CategorySelector :menu-items="menuItems" @category-change="onMenuChange" />
    <div v-if="initialBbox" class="flex flex-grow">
      <MapFeatures
        ref="mapFeatures"
        :default-bounds="initialBbox"
        :fit-bounds-padding-options="fitBoundsPaddingOptions"
        :extra-attributions="settings.attributions"
        :categories="menuItems"
        :features="mapFeatures"
        :selected-categories-ids="selectedCategoryIds"
        :style-icon-filter="poiFilters"
        :explorer-mode-enabled="explorerModeEnabled"
      />
      <div class="p-4 absolute">
        <SelectedCategories />
      </div>
    </div>
    <div class="fixed flex left-8 right-16 bottom-5 pointer-events-none">
      <PoiCard
        v-if="selectedFeature"
        :poi="selectedFeature"
        class="grow-0"
        :explorer-mode-enabled="explorerModeEnabled"
        :favorites-mode-enabled="false"
        :show-image="false"
        @explore-click="toggleExploreAroundSelectedPoi"
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
import SelectedCategories from '~/components/Home/SelectedCategories.vue'
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
    SelectedCategories,
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

  mounted() {
    // @ts-ignore
    this.initialBbox = this.settings.bbox_line.coordinates
  },

  watch: {
    selectedCategoryIds() {
      this.routerPushUrl()

      if (this.selectedCategoryIds) {
        this.$store.dispatch('menu/fetchFeatures', {
          apiEndpoint: this.$vidoConfig().API_ENDPOINT,
          apiProject: this.$vidoConfig().API_PROJECT,
          apiTheme: this.$vidoConfig().API_THEME,
          categoryIds: this.selectedCategoryIds,
        })
      }
    },

    selectedFeature() {
      this.routerPushUrl()
    },
  },

  methods: {
    ...mapActions({
      addSelectedCategoryIds: 'menu/addSelectedCategoryIds',
    }),

    onMenuChange(newCategoryId: number) {
      this.addSelectedCategoryIds([newCategoryId])
    },

    routerPushUrl() {
      const categoryIds = this.selectedCategoryIds.join(',')
      const id =
        this.selectedFeature?.properties?.metadata?.id?.toString() ||
        this.selectedFeature?.id?.toString() ||
        null

      this.$router.push({
        path:
          '/embedded' +
          (categoryIds ? `/${categoryIds}/` : '/') +
          (id ? `${id}` : ''),
        query: this.$router.currentRoute.query,
        hash: this.$router.currentRoute.hash,
      })
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
