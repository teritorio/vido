import { LngLatBoundsLike } from 'maplibre-gl'
import Vue, { PropType, VueConstructor } from 'vue'
import { mapActions } from 'vuex'

import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { ApiPoi } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        mapFeatures: InstanceType<typeof MapFeatures>
        bottomMenu: HTMLDivElement
      }
    }
  >
).extend({
  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
    initialCategoryIds: {
      type: Array as PropType<number[]>,
      default: null,
    },
    initialPoi: {
      type: Object as PropType<ApiPoi>,
      default: null,
    },
  },

  data(): {
    initialBbox: LngLatBoundsLike | null
  } {
    return {
      initialBbox: null,
    }
  },

  computed: {
    isModeExplorer(): boolean {
      return this.$store.getters['map/isModeExplorer']
    },

    menuItems(): Record<ApiMenuCategory['id'], MenuItem> {
      return this.$store.getters['menu/menuItems']
    },

    favoritesModeEnabled(): boolean {
      return this.settings.themes[0]?.favorites_mode ?? true
    },

    explorerModeEnabled(): boolean {
      return this.settings.themes[0]?.explorer_mode ?? true
    },

    selectedCategoryIds(): ApiMenuCategory['id'][] {
      return this.$store.getters['menu/selectedCategoryIds']
    },

    selectedFeature(): ApiPoi {
      return this.$store.getters['map/selectedFeature']
    },

    poiFilters(): string[][] | null {
      return (
        (this.isModeExplorer &&
          (Object.values(this.menuItems)
            .map((c) => c.category?.style_class)
            .filter((s) => s !== undefined) as string[][])) ||
        null
      )
    },
  },

  mounted() {
    if (this.initialCategoryIds) {
      this.setSelectedCategoryIds(this.initialCategoryIds)
    } else if (typeof location !== 'undefined') {
      const enabledCategories: ApiMenuCategory['id'][] = []

      Object.keys(this.menuItems).forEach((categoryIdString) => {
        const categoryId = parseInt(categoryIdString, 10)
        if (this.menuItems[categoryId].selected_by_default) {
          enabledCategories.push(categoryId)
        }
      })

      this.setSelectedCategoryIds(enabledCategories)
    }

    if (this.initialPoi) {
      this.setSelectedFeature(this.initialPoi)
    }
  },

  methods: {
    ...mapActions({
      setMode: 'map/setMode',
      setSelectedCategoryIds: 'menu/setSelectedCategoryIds',
      setSelectedFeature: 'map/setSelectedFeature',
    }),

    goToSelectedFeature() {
      this.$refs.mapFeatures?.goToSelectedFeature()
    },
  },
})
