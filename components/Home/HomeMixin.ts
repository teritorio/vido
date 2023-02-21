import { Polygon, MultiPolygon } from 'geojson'
import { LngLatBoundsLike } from 'maplibre-gl'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { defineComponent, PropType, ref } from 'vue'

import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { ApiPoi } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'
import { mapStore } from '~/stores/map'
import { menuStore } from '~/stores/menu'

export default defineComponent({
  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
    initialCategoryIds: {
      type: Array as PropType<number[] | undefined>,
      default: undefined,
    },
    initialPoi: {
      type: Object as PropType<ApiPoi | undefined>,
      default: undefined,
    },
    boundaryArea: {
      type: Object as PropType<Polygon | MultiPolygon | undefined>,
      default: undefined,
    },
  },

  setup() {
    return {
      mapFeatures: ref<InstanceType<typeof MapFeatures>>(),
      bottomMenu: ref<HTMLDivElement>(),
    }
  },

  data(): {
    initialBbox: LngLatBoundsLike | null
  } {
    return {
      initialBbox: null,
    }
  },

  computed: {
    ...mapState(mapStore, ['isModeExplorer', 'selectedFeature']),
    ...mapState(menuStore, ['apiMenuCategory', 'selectedCategoryIds']),
    ...mapWritableState(mapStore, ['mode']),

    favoritesModeEnabled(): boolean {
      return this.settings.themes[0]?.favorites_mode ?? true
    },

    explorerModeEnabled(): boolean {
      return this.settings.themes[0]?.explorer_mode ?? true
    },

    poiFilters(): string[][] | null {
      return (
        (this.isModeExplorer &&
          (Object.values(this.apiMenuCategory || {})
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

      Object.keys(this.apiMenuCategory || {}).forEach((categoryIdString) => {
        const categoryId = parseInt(categoryIdString, 10)
        if (this.apiMenuCategory![categoryId].selected_by_default) {
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
    ...mapActions(mapStore, ['setSelectedFeature']),
    ...mapActions(menuStore, ['setSelectedCategoryIds']),

    goToSelectedFeature() {
      this.mapFeatures?.goToSelectedFeature()
    },
  },
})
