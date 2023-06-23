<template>
  <div
    :class="[
      'tw-flex tw-h-screen',
      'tw-flex-col-reverse',
      'md:tw-flex-row md:tw-w-screen',
    ]"
  >
    <div
      v-if="selectedFeature"
      :class="[
        'tw-h-screen tw-p-4 tw-bg-white tw-z-20',
        'tw-absolute tw-w-screen',
        'md:tw-relative md:tw-w-1/3 md:tw-max-w-md tw-overflow-scroll',
      ]"
    >
      <div class="tw-grid tw-justify-items-end tw-pb-4">
        <UIButton
          :label="$t('ui.close')"
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
    <div class="tw-grow">
      <div v-if="initialBbox" class="tw-flex tw-flex-col tw-h-screen">
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
        <CategorySelector
          :menu-items="Object.values(apiMenuCategory || {})"
          label="categorySelector.placeholderAdd"
          class="tw-p-4 tw-fixed tw-z-1 tw-w-full"
          @category-change="onMenuChange"
        />
        <div class="tw-p-4 tw-pt-24 tw-absolute">
          <SelectedCategories />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { FitBoundsOptions } from 'maplibre-gl'
import { mapActions } from 'pinia'

import { defineNuxtComponent, useRequestHeaders } from '#app'
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

export default defineNuxtComponent({
  components: {
    CategorySelector,
    MapFeatures,
    SelectedCategories,
    PoiCardContent,
    UIButton,
  },
  mixins: [HomeMixin],

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

  watch: {
    selectedCategoryIds() {
      this.routerPushUrl()

      if (this.selectedCategoryIds) {
        menuStore().fetchFeatures({
          vidoConfig: this.$vidoConfig(useRequestHeaders()),
          categoryIds: this.selectedCategoryIds,
        })
      }
    },

    selectedFeature() {
      this.routerPushUrl()
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
        query: this.$router.currentRoute.value.query,
        hash: this.$router.currentRoute.value.hash,
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
