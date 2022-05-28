<template>
  <div class="w-full h-full">
    <div
      :class="[
        'relative flex flex-col w-full h-full md:h-full',
        !small && 'h-full',
      ]"
    >
      <MapFeatures
        ref="mapFeatures"
        :default-bounds="defaultBounds"
        :fit-bounds-padding-options="fitBoundsPaddingOptions"
        :extra-attributions="extraAttributions"
        :small="small"
        :categories="categories"
        :features="mapFeatures"
        :selected-feature="selectedFeature"
        :selected-categories="mapCategories"
        :style-icon-filter="(isModeExplorer && poiFilters) || null"
        @on-select-feature="setSelectedFeature($event)"
        @full-attribution="$emit('full-attribution', $event)"
      />
      <aside class="pointer-events-none">
        <div
          :class="[
            'absolute flex justify-end pointer-events-auto items-top pt-4 right-3 md:pt-0 w-40 md:w-48 top-4',
            small && 'hidden',
          ]"
        >
          <FavoriteMenu
            :has-favorites="favoritesIds.length !== 0"
            :explore-around-selected-poi="exploreAroundSelectedPoi"
            :go-to-selected-poi="goToSelectedFeature"
            :toggle-favorite="toggleFavorite"
            @toggle-favorites="onToggleFavoritesMode"
          />
          <NavMenu class="ml-3 sm:ml-9" />
        </div>
      </aside>

      <div
        v-if="isLoadingFeatures"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
      >
        <font-awesome-icon
          icon="spinner"
          class="text-zinc-400 animate-spin"
          size="3x"
        />
      </div>
      <FavoritesOverlay
        v-if="showFavoritesOverlay"
        @discard="showFavoritesOverlay = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { FitBoundsOptions, LngLatBoundsLike } from 'maplibre-gl'
import Vue, { PropType, VueConstructor } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import FavoriteMenu from '@/components/MainMap/FavoriteMenu.vue'
import FavoritesOverlay from '@/components/MainMap/FavoritesOverlay.vue'
import MapFeatures from '@/components/MainMap/MapFeatures.vue'
import NavMenu from '@/components/MainMap/NavMenu.vue'
import { ApiMenuCategory } from '@/lib/apiMenu'
import { getPoiByIds, ApiPoi } from '@/lib/apiPois'
import { LOCAL_STORAGE } from '@/lib/constants'
import { Mode } from '@/utils/types'
import { getHashPart } from '@/utils/url'

import { flattenFeatures } from '~/utils/utilities'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        mapFeatures: InstanceType<typeof MapFeatures>
      }
    }
  >
).extend({
  components: {
    MapFeatures,
    FavoritesOverlay,
    NavMenu,
    FavoriteMenu,
  },

  props: {
    defaultBounds: {
      type: [Array, Object] as PropType<LngLatBoundsLike>,
      default: null,
    },
    fitBoundsPaddingOptions: {
      type: [Number, Object] as PropType<FitBoundsOptions['padding']>,
      default: 50,
    },
    extraAttributions: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    small: {
      type: Boolean,
      default: false,
    },
    getSubCategory: {
      type: Function,
      default: null,
    },
    selectedCategories: {
      type: Array as PropType<ApiMenuCategory['id'][]>,
      default: () => [],
    },
  },

  data(): {
    allowRegionBackZoom: boolean
    showPoiToast: boolean
    showFavoritesOverlay: boolean
    favorites: ApiPoi[] | null
  } {
    return {
      allowRegionBackZoom: false,
      showFavoritesOverlay: false,
      showPoiToast: false,
      favorites: null,
    }
  },

  computed: {
    ...mapGetters({
      pois: 'menu/features',
      mode: 'map/mode',
      isModeExplorer: 'map/isModeExplorer',
      isModeFavorites: 'map/isModeFavorites',
      isLoadingFeatures: 'menu/isLoadingFeatures',
      favoritesIds: 'favorite/favoritesIds',
      selectedFeature: 'map/selectedFeature',
    }),

    categories(): Record<ApiMenuCategory['id'], ApiMenuCategory> {
      return this.$store.getters['menu/categories']
    },

    poiFilters(): Array<string[]> {
      return Object.values(this.categories)
        .map((c) => c.category?.style_class)
        .filter((s) => s && Array.isArray(s))
    },

    mapFeatures(): ApiPoi[] {
      let feature: ApiPoi[]
      switch (this.mode as Mode) {
        case Mode.BROWSER:
          feature = flattenFeatures(this.pois)
          break
        case Mode.FAVORITES:
          feature = this.favorites || []
          break
        case Mode.EXPLORER:
          feature = []
          break
      }
      return feature
    },

    mapCategories(): string[] {
      return (
        (!this.isModeExplorer &&
          !this.isModeFavorites &&
          Object.keys(this.pois)) ||
        []
      )
    },
  },

  watch: {
    favoritesIds() {
      this.handleFavorites()
    },

    isModeFavorites() {
      this.handleFavorites()
    },

    mode() {
      this.allowRegionBackZoom = false
    },

    showPoiToast(val) {
      this.$emit('show-poi', val)
    },

    selectedFeature() {
      if (this.selectedFeature) {
        this.showPoiToast = true
      }
    },
  },

  beforeMount() {
    const favorites =
      localStorage.getItem(LOCAL_STORAGE.favorites) || '{ "favorites": [] }'

    this.toggleFavoritesMode(JSON.parse(favorites).favorites)

    const mode = getHashPart(this.$router, 'mode') || Mode.BROWSER
    this.setMode(mode)

    const favs = getHashPart(this.$router, 'favs')
    if (favs) {
      try {
        const newFavorite = favs
          .split(',')
          .map((e) => (!isNaN(Number(e)) ? Number(e) : null))
          .filter((e) => !!e)

        localStorage.setItem(
          LOCAL_STORAGE.favorites,
          JSON.stringify({ favorites: newFavorite, version: 1 })
        )
        this.toggleFavoritesMode(newFavorite)
        this.handleFavorites()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    }
  },

  methods: {
    ...mapActions({
      setMode: 'map/setMode',
      toggleFavoritesMode: 'favorite/toggleFavoritesMode',
      setSelectedFeature: 'map/setSelectedFeature',
    }),

    setPoiToastVisibility(visible: boolean) {
      this.showPoiToast = visible
    },

    exploreAroundSelectedPoi(feature?: ApiPoi) {
      if (feature) {
        this.setSelectedFeature(feature)
      }
      if (!this.isModeExplorer) {
        this.setMode(Mode.EXPLORER)
        this.goToSelectedFeature()

        if (this.$screen.smallScreen) {
          this.showPoiToast = false
        }
      } else {
        this.allowRegionBackZoom = false
        this.setMode(Mode.BROWSER)
      }
    },

    toggleFavorite(feature?: ApiPoi, isNotebook?: boolean) {
      if (feature && !isNotebook) {
        this.setSelectedFeature(feature)
      }
      try {
        const props = feature?.properties
        const id = props?.metadata?.id || feature?.id
        const currentFavorites = localStorage.getItem(LOCAL_STORAGE.favorites)
        let newFavorite

        if (id) {
          if (currentFavorites) {
            const parsedFavorites = JSON.parse(currentFavorites).favorites
            if (!parsedFavorites.includes(id)) {
              newFavorite = [...parsedFavorites, id]
            } else {
              newFavorite = parsedFavorites.filter(
                (f: string) => `${f}` !== `${id}`
              )
            }
          } else {
            newFavorite = [id]
          }

          localStorage.setItem(
            LOCAL_STORAGE.favorites,
            JSON.stringify({ favorites: newFavorite, version: 1 })
          )
          this.toggleFavoritesMode(newFavorite)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },

    handleFavorites() {
      this.fetchFavorites(this.favoritesIds).then((favorites) => {
        this.favorites = favorites
      })
    },

    fetchFavorites(ids: [string]): Promise<ApiPoi[]> {
      return getPoiByIds(
        this.$vidoConfig.API_ENDPOINT,
        this.$vidoConfig.API_PROJECT,
        this.$vidoConfig.API_THEME,
        ids
      )
        .then((pois) => (pois && pois.features) || [])
        .then((pois) =>
          pois.map((poi) => ({
            ...poi,
            properties: {
              ...poi.properties,
              vido_cat: poi.properties.metadata?.category_ids?.[0],
            },
          }))
        )
    },

    onToggleFavoritesMode() {
      if (this.favoritesIds?.length > 0) {
        this.$tracking({ type: 'map_control_event', event: 'favorite' })
        if (!this.isModeFavorites) {
          this.setMode(Mode.FAVORITES)
        } else {
          this.setMode(Mode.BROWSER)
        }
      } else {
        this.showFavoritesOverlay = true
      }
    },

    goToSelectedFeature() {
      this.$refs.mapFeatures.goToSelectedFeature()
    },
  },
})
</script>
