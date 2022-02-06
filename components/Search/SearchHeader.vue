<template>
  <aside
    :class="[
      'flex flex-col max-h-full px-5 py-4 space-y-6 shadow-md pointer-events-auto sm:rounded-xl md:w-96',
      isExplorerFavorite ? 'bg-blue-500 sm:bg-white text-white' : 'bg-white',
    ]"
  >
    <div class="flex flex-row sm:flex-col items-center sm:items-start">
      <h1 v-if="!isExplorerFavorite" class="flex-none sm:hidden mr-2">
        <img
          :aria-label="siteName"
          :src="logoUrl"
          class="w-auto h-auto max-w-2xl max-h-12 sm:max-h-16"
        />
      </h1>

      <button
        type="button"
        class="hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-gray-800" size="xs" />
      </button>

      <form
        v-if="!isExplorerFavorite"
        ref="searchform"
        class="flex-grow relative pointer-events-auto w-full"
        @submit.prevent="onSubmit"
      >
        <section class="relative w-full">
          <input
            ref="search"
            :value="searchText"
            class="w-full px-5 py-3 font-medium text-gray-700 placeholder-gray-500 bg-gray-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-gray-300"
            :placeholder="$tc('headerMenu.search')"
            type="text"
            @input="
              searchText = $event.target.value
              onSubmit()
            "
            @focus="$tracking({ type: 'search' })"
          />
          <button
            class="absolute inset-y-0 right-0 px-5 text-gray-800 rounded-r-full outline-none focus:outline-none"
            type="submit"
            :disabled="isLoading"
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
          class="flex flex-shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
          @click="goToCategories"
        >
          <font-awesome-icon icon="arrow-left" class="text-inherit" size="xs" />
        </button>
        <p class="ml-2">
          {{
            $tc(
              isFavorite
                ? 'headerMenu.backToMenuFavorites'
                : 'headerMenu.backToMenuExplorer'
            )
          }}
        </p>
      </div>
    </div>

    <button
      v-if="results > 0"
      type="button"
      class="sm:hidden flex-shrink-0 w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
      @click="reset"
    >
      <font-awesome-icon icon="arrow-left" class="text-gray-800" size="xs" />
    </button>

    <div v-if="results > 0" class="overflow-y-auto">
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
import debounce from 'lodash.debounce'
import Vue, { PropType } from 'vue'

import SearchResultBlock from '@/components/Search/SearchResultBlock.vue'
import { MAP_ZOOM } from '@/lib/constants'
import {
  ApiPoisSearchResult,
  ApiMenuItemSearchResult,
  ApiAddrSearchResult,
  SearchResult,
  ApiSearchResult,
  VidoFeature,
} from '@/utils/types'

export default Vue.extend({
  components: {
    SearchResultBlock,
  },

  props: {
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
    isExplorerFavorite: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    mapCenter: {
      type: Object as PropType<{ lng: number; lat: number }>,
      default: () => ({ lng: 0, lat: 0 }),
    },
  },

  data(): {
    searchText: string
    searchMenuItemsResults: null | ApiSearchResult<ApiMenuItemSearchResult>
    searchPoisResults: null | ApiSearchResult<ApiPoisSearchResult>
    searchAddressesResults: null | ApiSearchResult<ApiAddrSearchResult>
    searchCartocodeResult: null | VidoFeature
    isLoading: boolean
    search: null | Function
  } {
    return {
      searchText: '',
      searchMenuItemsResults: null,
      searchPoisResults: null,
      searchAddressesResults: null,
      searchCartocodeResult: null,
      isLoading: false,
      search: null,
    }
  },

  computed: {
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
        this.itemsMenuItems.length +
        this.itemsPois.length +
        this.itemsAddresses.length
      )
    },
  },

  watch: {
    searchCartocodeResult(val: null | VidoFeature) {
      if (val && val.properties?.metadata?.id) {
        this.onPoiClick(val.properties.metadata.id)
      }
    },
  },

  created() {
    this.search = debounce(this.search_, 300)
  },

  mounted() {
    if (!this.$isMobile()) {
      this.focusSearch()
    }
  },

  methods: {
    reset() {
      this.isLoading = false
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

    onPoiClick(id: number) {
      this.$emit('poi-click', id)
      this.reset()
    },

    focusSearch() {
      ;(this.$refs.search as HTMLInputElement).focus()
    },

    onAddressClick(id: number) {
      const feature = (this.searchAddressesResults?.features || []).find(
        (a) => a.properties.id === id
      )
      if (feature) {
        const f = Object.assign({}, feature, {
          faIcon: 'home',
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
      if (
        !this.isLoading &&
        (!this.searchText || this.searchText.trim().length === 0)
      ) {
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

    async search_() {
      if (!this.isLoading && this.searchText) {
        const projectTheme = `project_theme=${this.$config.API_PROJECT}-${this.$config.API_THEME}`
        const searchText = this.searchText.trim()
        if (searchText.length === 2) {
          this.isLoading = true

          const cartocode = this.searchText
          const searchPoi: Promise<VidoFeature> = fetch(
            `${this.$config.API_ENDPOINT}/${this.$config.API_PROJECT}/${this.$config.API_THEME}/poi/cartocode:${cartocode}`
          ).then((data) => (data.ok ? data.json() : null))

          const [poi] = await Promise.all([searchPoi])

          this.searchMenuItemsResults = null
          this.searchPoisResults = null
          this.searchAddressesResults = null
          this.searchCartocodeResult = poi
          this.isLoading = false
        } else if (searchText.length > 2) {
          this.isLoading = true

          const query = `q=${this.searchText}&lon=${this.mapCenter.lng}&lat=${this.mapCenter.lat}`

          const MenuItemsFetch: Promise<
            ApiSearchResult<ApiMenuItemSearchResult>
          > = fetch(
            `${this.$config.API_SEARCH}?${projectTheme}&type=menu_item&${query}`
          ).then((data) => (data.ok ? data.json() : null))

          const poisFetch: Promise<
            ApiSearchResult<ApiPoisSearchResult>
          > = fetch(
            `${this.$config.API_SEARCH}?${projectTheme}&type=poi&${query}&limit=10`
          ).then((data) => (data.ok ? data.json() : null))

          const addressesFetch: Promise<
            ApiSearchResult<ApiAddrSearchResult>
          > = fetch(`${this.$config.API_SEARCH_ADDR}?${query}`).then((data) =>
            data.ok ? data.json() : null
          )

          const [
            searchMenuItemsResults,
            searchPoisResults,
            searchAddressesResults,
          ] = await Promise.all([MenuItemsFetch, poisFetch, addressesFetch])
          this.searchMenuItemsResults = searchMenuItemsResults
          this.searchPoisResults = searchPoisResults
          this.searchAddressesResults = searchAddressesResults
          this.searchCartocodeResult = null
          this.isLoading = false
        }
      }
    },
  },
})
</script>
