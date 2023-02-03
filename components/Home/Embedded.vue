<template>
  <div class="flex flex-col h-screen">
    <CategorySelector
      :menu-items="menuItems"
      :category-id="categoryId"
      @category-change="onMenuChange"
    />
    <div class="flex flex-grow">
      <MapPois
        :extra-attributions="settings.attributions"
        :features="features"
        :default-bounds="settings.bbox_line.coordinates"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import MapPois from '~/components/Map/MapPois.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { ApiPoi, getPoiByCategoryId } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'
import { getBBoxCoordList } from '~/lib/bbox'

export default Vue.extend({
  components: {
    CategorySelector,
    MapPois,
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

<style>
#map-container {
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
