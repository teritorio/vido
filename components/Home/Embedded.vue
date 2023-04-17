<template>
  <div
    :class="['flex h-screen', 'flex-col-reverse', 'md:flex-row md:w-screen']"
  >
    <div
      v-if="selectedFeature"
      :class="[
        'h-screen p-4 bg-white z-20',
        'absolute w-screen',
        'md:relative md:w-1/3 md:max-w-md overflow-scroll',
      ]"
    >
      <div class="grid justify-items-end pb-4">
        <UIButton
          :label="$tc('ui.close')"
          icon="times"
          @click="setSelectedFeature(null)"
        />
      </div>
      <PoiCardContent
        :poi="selectedFeature"
        :explorer-mode-enabled="explorerModeEnabled"
        :favorites-mode-enabled="false"
        @explore-click="toggleExploreAroundSelectedPoi"
        @zoom-click="goToSelectedFeature"
      />
    </div>
    <div class="grow">
      <div class="flex flex-col h-screen">
        <CategorySelector
          :menu-items="Object.values(apiMenuCategory || {})"
          @category-change="onMenuChange"
        />
        <div v-if="initialBbox" class="flex flex-grow">
          <MapFeatures
            ref="mapFeatures"
            :default-bounds="initialBbox"
            :fit-bounds-padding-options="fitBoundsPaddingOptions"
            :extra-attributions="settings.attributions"
            :categories="apiMenuCategory || []"
            :features="mapFeatures"
            :selected-categories-ids="selectedCategoryIds"
            :style-icon-filter="poiFilters"
            :explorer-mode-enabled="explorerModeEnabled"
            :cooperative-gestures="false"
            :boundary-area="boundaryArea || settings.polygon.data"
          />
          <div class="p-4 absolute">
            <SelectedCategories />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { FitBoundsOptions } from 'maplibre-gl'
import { mapActions } from 'pinia'
import mixins from 'vue-typed-mixins'

import HomeMixin from '~/components/Home/HomeMixin'
import SelectedCategories from '~/components/Home/SelectedCategories.vue'
import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import PoiCardContent from '~/components/PoisCard/PoiCardContent.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'
import UIButton from '~/components/UI/UIButton.vue'
import { ApiPoi } from '~/lib/apiPois'
import { getBBoxFeature } from '~/lib/bbox'
import { mapStore } from '~/stores/map'
import { menuStore } from '~/stores/menu'
import { Mode } from '~/utils/types'
import { flattenFeatures } from '~/utils/utilities'

export default mixins(HomeMixin).extend({
  components: {
    CategorySelector,
    MapFeatures,
    SelectedCategories,
    PoiCardContent,
    UIButton,
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
      return flattenFeatures(menuStore().features)
    },
  },

  mounted() {
    if (this.boundaryArea) {
      this.initialBbox = getBBoxFeature(this.boundaryArea)
    } else {
      // @ts-ignore
      this.initialBbox = this.settings.bbox_line.coordinates
    }
  },

  watch: {
    selectedCategoryIds() {
      this.routerPushUrl()

      if (this.selectedCategoryIds) {
        menuStore().fetchFeatures({
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
    ...mapActions(menuStore, ['addSelectedCategoryIds']),

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
        this.mode = Mode.EXPLORER
        this.goToSelectedFeature()
      } else {
        this.mode = Mode.BROWSER
      }
    },
  },
})
</script>
