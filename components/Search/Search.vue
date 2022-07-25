<template>
  <aside
    :class="[
      'flex flex-col max-h-full px-5 py-4 space-y-6 shadow-md pointer-events-auto md:rounded-xl md:w-96',
      isModeExplorerOrFavorites
        ? 'bg-blue-500 md:bg-white text-white'
        : 'bg-white',
    ]"
  >
    <div class="flex flex-row md:flex-col items-center md:items-start">
      <h1 v-if="!isModeExplorerOrFavorites" class="flex-none md:hidden mr-2">
        <a
          :href="mainUrl"
          rel="noopener noreferrer"
          :aria-label="siteName"
          :title="siteName"
          target="_blank"
        >
          <img
            :aria-label="siteName"
            :src="logoUrl"
            class="w-auto h-auto max-w-2xl max-h-12 md:max-h-16"
          />
        </a>
      </h1>

      <button
        type="button"
        class="hidden md:flex shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-zinc-800" size="xs" />
      </button>

      <form
        v-if="!isModeExplorerOrFavorites"
        ref="searchform"
        class="flex-grow relative pointer-events-auto w-full"
        @submit.prevent="onSubmit"
      >
        <section class="relative w-full">
          <input
            ref="search"
            :value="searchText"
            class="w-full px-5 py-3 font-medium text-zinc-700 placeholder-zinc-500 bg-zinc-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-zinc-300"
            :placeholder="$tc('headerMenu.search')"
            type="text"
            @input="
              searchText = $event.target.value
              onSubmit()
            "
            @focus="$tracking({ type: 'search' })"
          />
          <button
            class="absolute inset-y-0 right-0 px-5 text-zinc-800 rounded-r-full outline-none focus:outline-none"
            type="submit"
            @click="focusSearch"
          >
            <font-awesome-icon v-if="!isLoading" icon="search" />
            <font-awesome-icon v-else icon="spinner" class="animate-spin" />
          </button>
        </section>
      </form>
      <div v-else class="flex items-center ml-2">
        <button
          type="button"
          class="flex shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
          @click="goToCategories"
        >
          <font-awesome-icon icon="arrow-left" class="text-inherit" size="xs" />
        </button>
        <p class="ml-2">
          {{
            $tc(
              isModeFavorites
                ? 'headerMenu.backToMenuFavoritesMobile'
                : 'headerMenu.backToMenuExplorerMobile'
            )
          }}
        </p>
      </div>
    </div>

    <button
      v-if="results > 0"
      type="button"
      class="md:hidden shrink-0 w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
      @click="reset"
    >
      <font-awesome-icon icon="arrow-left" class="text-zinc-800" size="xs" />
    </button>

    <div v-if="results > 0" class="search-results">
      <SearchResultBlock
        v-if="itemsCartocode.length > 0"
        type="cartocode"
        :label="$tc('headerMenu.cartocode')"
        icon="layer-group"
        :items="itemsCartocode"
        @item-click="onCartocodeClick"
      />

      <SearchResultBlock
        v-if="itemsMenuItems.length > 0"
        type="category"
        :label="$tc('headerMenu.categories')"
        icon="layer-group"
        :items="itemsMenuItems"
        @item-click="onCategoryClick"
      />

      <SearchResultBlock
        v-if="itemsPois.length > 0"
        type="pois"
        :label="$tc('headerMenu.pois')"
        icon="map-marker-alt"
        :items="itemsPois"
        @item-click="onPoiClick"
      />

      <SearchResultBlock
        v-if="itemsAddresses.length > 0"
        type="addresse"
        :label="$tc('headerMenu.addresses')"
        icon="home"
        :items="itemsAddresses"
        @item-click="onAddressClick"
      />

      <p v-if="results === 0">
        {{ $tc('headerMenu.noResult') }}
      </p>
    </div>
  </aside>
</template>

<script lang="ts">
import { debounce, DebouncedFunc } from 'lodash'
import Vue, { PropType, VueConstructor } from 'vue'
import { mapGetters } from 'vuex'

import SearchResultBlock from '~/components/Search/SearchResultBlock.vue'
import { ApiPoi, ApiPoiId, getPoiById } from '~/lib/apiPois'
import {
  ApiPoisSearchResult,
  ApiMenuItemSearchResult,
  ApiAddrSearchResult,
  SearchResult,
  ApiSearchResult,
} from '~/lib/apiSearch'
import { MAP_ZOOM } from '~/lib/constants'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        search: InstanceType<typeof HTMLInputElement> | null
      }
    }
  >
).extend({
  components: {
    SearchResultBlock,
  },

  props: {
    mainUrl: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    menuToIcon: {
      type: Object as PropType<{ [id: string]: string }>,
      required: true,
    },
    mapCenter: {
      type: Object as PropType<{ lng: number; lat: number }>,
      default: () => ({ lng: 0, lat: 0 }),
    },
  },

  data(): {
    searchQueryId: number
    searchResultId: number
    searchText: string
    searchMenuItemsResults: null | ApiSearchResult<ApiMenuItemSearchResult>
    searchPoisResults: null | ApiSearchResult<ApiPoisSearchResult>
    searchAddressesResults: null | ApiSearchResult<ApiAddrSearchResult>
    searchCartocodeResult: null | ApiPoi
    search: null | DebouncedFunc<() => void>
    trackSearchQuery: null | DebouncedFunc<(query: string) => void>
  } {
    return {
      searchQueryId: 0,
      searchResultId: 0,
      searchText: '',
      searchMenuItemsResults: null,
      searchPoisResults: null,
      searchAddressesResults: null,
      searchCartocodeResult: null,
      search: null,
      trackSearchQuery: null,
    }
  },

  computed: {
    ...mapGetters({
      isModeFavorites: 'map/isModeFavorites',
      isModeExplorerOrFavorites: 'map/isModeExplorerOrFavorites',
    }),

    isLoading(): boolean {
      return this.searchResultId !== this.searchQueryId
    },

    itemsCartocode(): SearchResult[] {
      const v = this.searchCartocodeResult
      if (v && v.properties.metadata?.id) {
        const label =
          v.properties.name || v.properties.editorial?.class_label?.fr
        if (label) {
          return [
            {
              id: v.properties.metadata?.id,
              label,
            },
          ]
        }
      }
      return []
    },

    itemsMenuItems(): SearchResult[] {
      return (
        this.searchMenuItemsResults?.features?.map((v) => ({
          id: v.properties.id,
          label: v.properties.label,
          icon: this.menuToIcon[v.properties.id],
          filter_property: v.properties.filter_property,
          filter_value: v.properties.filter_value,
        })) || []
      )
    },

    itemsPois(): SearchResult[] {
      return (
        this.searchPoisResults?.features?.map((v) => ({
          id: v.properties.id,
          label: v.properties.label,
          icon: v.properties.icon,
          small: v.properties.city,
        })) || []
      )
    },

    itemsAddresses(): SearchResult[] {
      return (
        this.searchAddressesResults?.features?.map((v) => ({
          id: v.properties.id,
          label: v.properties.label,
          icon:
            v.properties.type === 'municipality' ? 'city' : 'map-marker-alt',
        })) || []
      )
    },

    results(): Number {
      return (
        this.itemsCartocode.length +
        this.itemsMenuItems.length +
        this.itemsPois.length +
        this.itemsAddresses.length
      )
    },
  },

  created() {
    this.search = debounce(this.search_, 300)
    this.trackSearchQuery = debounce(this.trackSearchQuery_, 3000)
  },

  mounted() {
    if (!this.$screen.touch) {
      this.focusSearch()
    }
  },

  methods: {
    reset() {
      this.searchMenuItemsResults = null
      this.searchPoisResults = null
      this.searchAddressesResults = null
      this.searchCartocodeResult = null
      this.searchText = ''
    },

    onGoBackClick() {
      this.$emit('go-back-click')
    },

    goToCategories() {
      this.$emit('go-to-categories')
    },

    onCartocodeClick(id: number) {
      const cartocodeId = this.searchCartocodeResult?.properties.metadata?.id
      if (cartocodeId === id) {
        this.onPoiClick(cartocodeId)
      }
    },

    onCategoryClick(category: SearchResult) {
      if (this.searchMenuItemsResults) {
        const filter = this.searchMenuItemsResults.features.find(
          (a) =>
            a.properties.filter_property === category.filter_property &&
            a.properties.filter_value === category.filter_value &&
            a.properties.id === category.id
        )

        if (filter?.properties) {
          this.$emit('category-click', filter.properties)
          this.reset()
        }
      }
    },

    onPoiClick(id: ApiPoiId) {
      this.$emit('poi-click', id)
      this.reset()
    },

    focusSearch() {
      this.$refs.search?.focus()
    },

    onAddressClick(id: number) {
      const feature = (this.searchAddressesResults?.features || []).find(
        (a) => a.properties.id === id
      )
      if (feature) {
        const f = Object.assign({}, feature, {
          class: 'Adresse',
          vido_zoom:
            feature.properties.type === 'municipality'
              ? MAP_ZOOM.selectionZoom.municipality
              : MAP_ZOOM.selectionZoom.streetNumber,
        })
        this.$emit('feature-click', f)
      }
      this.reset()
    },

    onSubmit() {
      // Reset results if empty search text
      if (!this.searchText || this.searchText.trim().length === 0) {
        this.searchMenuItemsResults = null
        this.searchPoisResults = null
        this.searchAddressesResults = null
        this.searchCartocodeResult = null
      }

      // Launch search if not already loading + search text length >= 3
      if (this.search) {
        this.search()
      }
    },

    search_() {
      if (this.searchText) {
        if (this.trackSearchQuery) {
          this.trackSearchQuery.cancel()
          this.trackSearchQuery(this.searchText)
        }

        this.searchQueryId += 1
        const currentSearchQueryId = this.searchQueryId

        const projectTheme = `project_theme=${this.$vidoConfig.API_PROJECT}-${this.$vidoConfig.API_THEME}`
        const searchText = this.searchText.trim()
        if (searchText.length === 2) {
          const cartocode = this.searchText
          getPoiById(
            this.$vidoConfig.API_ENDPOINT,
            this.$vidoConfig.API_PROJECT,
            this.$vidoConfig.API_THEME,
            `cartocode:${cartocode}`
          )
            .then((poi) => {
              if (currentSearchQueryId > this.searchResultId) {
                this.searchResultId = currentSearchQueryId

                this.searchMenuItemsResults = null
                this.searchPoisResults = null
                this.searchAddressesResults = null
                this.searchCartocodeResult = poi
              }
            })
            .catch(() => {
              // Deals with 404 and error from API
              if (currentSearchQueryId > this.searchResultId) {
                this.searchResultId = currentSearchQueryId

                this.searchMenuItemsResults = null
                this.searchPoisResults = null
                this.searchAddressesResults = null
                this.searchCartocodeResult = null
              }
            })
        } else if (searchText.length > 2) {
          const query = `q=${this.searchText}&lon=${this.mapCenter.lng}&lat=${this.mapCenter.lat}`

          const MenuItemsFetch: Promise<
            ApiSearchResult<ApiMenuItemSearchResult>
          > = fetch(
            `${this.$vidoConfig.API_SEARCH}?${projectTheme}&type=menu_item&${query}`
          ).then((data) => (data.ok ? data.json() : null))

          const poisFetch: Promise<ApiSearchResult<ApiPoisSearchResult>> =
            fetch(
              `${this.$vidoConfig.API_SEARCH}?${projectTheme}&type=poi&${query}&limit=10`
            ).then((data) => (data.ok ? data.json() : null))

          const addressesFetch: Promise<ApiSearchResult<ApiAddrSearchResult>> =
            fetch(`${this.$vidoConfig.API_SEARCH_ADDR}?${query}`).then((data) =>
              data.ok ? data.json() : null
            )

          Promise.all<
            ApiSearchResult<ApiMenuItemSearchResult>,
            ApiSearchResult<ApiPoisSearchResult>,
            ApiSearchResult<ApiAddrSearchResult>
          >([MenuItemsFetch, poisFetch, addressesFetch])
            .then(
              ([
                searchMenuItemsResults,
                searchPoisResults,
                searchAddressesResults,
              ]) => {
                if (currentSearchQueryId > this.searchResultId) {
                  this.searchResultId = currentSearchQueryId

                  this.searchMenuItemsResults = searchMenuItemsResults
                  this.searchPoisResults = searchPoisResults
                  this.searchAddressesResults = searchAddressesResults
                  this.searchCartocodeResult = null
                }
              }
            )
            .catch(() => {
              // Deals with error from API
              if (currentSearchQueryId > this.searchResultId) {
                this.searchResultId = currentSearchQueryId

                this.searchMenuItemsResults = null
                this.searchPoisResults = null
                this.searchAddressesResults = null
                this.searchCartocodeResult = null
              }
            })
        }
      }
    },

    trackSearchQuery_(searchText: string) {
      this.$tracking({ type: 'search_query', query: searchText })
    },
  },
})
</script>

<style>
.search-results {
  height: auto;
  overflow-y: auto;
  max-height: calc(100vh - 168px);
}
</style>
