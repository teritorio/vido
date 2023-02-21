<template>
  <div>
    <div class="flex flex-row items-center">
      <template v-if="!focus">
        <slot />
      </template>
      <SearchInput
        :search-text="searchText"
        :is-loading="isLoading"
        @input="onSubmit"
        @focus="onSearchFocus"
        @blur="delayedFocusLose($event)"
      />
    </div>

    <button
      v-if="focus && results > 0"
      type="button"
      class="shrink-0 w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-zinc-100 focus:bg-zinc-100"
      @click="reset"
    >
      <font-awesome-icon icon="arrow-left" class="text-zinc-800" size="xs" />
    </button>

    <div v-if="focus && results > 0" class="search-results">
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
  </div>
</template>

<script lang="ts">
import copy from 'fast-copy'
import { debounce, DebouncedFunc } from 'lodash'
import Vue, { PropType } from 'vue'
import { mapActions } from 'vuex'

import SearchInput from '~/components/Search/SearchInput.vue'
import SearchResultBlock from '~/components/Search/SearchResultBlock.vue'
import { ApiMenuCategory } from '~/lib/apiMenu'
import { ApiPoi, ApiPoiId, getPoiById } from '~/lib/apiPois'
import {
  ApiPoisSearchResult,
  ApiMenuItemSearchResult,
  ApiAddrSearchResult,
  SearchResult,
  ApiSearchResult,
} from '~/lib/apiSearch'
import { MAP_ZOOM } from '~/lib/constants'
import { FilterValue, FilterValues } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    SearchInput,
    SearchResultBlock,
  },

  props: {
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
    focus: boolean
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
      focus: false,
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
    filters(): Record<ApiMenuCategory['id'], FilterValues> {
      return this.$store.getters['menu/filters']
    },

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

  methods: {
    ...mapActions({
      setSelectedFeature: 'map/setSelectedFeature',
      addSelectedCategoryIds: 'menu/addSelectedCategoryIds',
      applyCategoriesFilters: 'menu/applyFilters',
    }),

    reset() {
      this.searchMenuItemsResults = null
      this.searchPoisResults = null
      this.searchAddressesResults = null
      this.searchCartocodeResult = null
      this.searchText = ''
      this.focus = false
    },

    delayedFocusLose(event: Event) {
      // Let time to catch click on results before hiden
      setTimeout(() => {
        this.$emit('blur', event)
        this.focus = false
      }, 200)
    },

    onSearchFocus(event: Event) {
      this.$emit('focus', event)
      this.focus = true
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
          const newFilter = filter.properties
          if (newFilter.filter_property) {
            const filters = copy(this.filters[newFilter.id])
            const filter = filters.find(
              (filter: FilterValue) =>
                (filter.type === 'boolean' ||
                  filter.type === 'multiselection' ||
                  filter.type === 'checkboxes_list') &&
                filter.def.property === newFilter.filter_property
            )
            if (filter) {
              switch (filter?.type) {
                case 'boolean':
                  if (newFilter.filter_value === true) {
                    filter.filterValue = newFilter.filter_value
                  }
                  break
                case 'multiselection':
                case 'checkboxes_list':
                  filter.filterValues = [newFilter.filter_value as string]
                  break
              }

              this.applyCategoriesFilters({
                categoryId: newFilter.id,
                filterValues: filters,
              })
            }
          }

          this.addSelectedCategoryIds([newFilter.id])

          this.reset()
        }
      }
    },

    onPoiClick(id: ApiPoiId) {
      getPoiById(
        this.$vidoConfig().API_ENDPOINT,
        this.$vidoConfig().API_PROJECT,
        this.$vidoConfig().API_THEME,
        id
      ).then((poi) => {
        this.setSelectedFeature(poi)
      })

      this.reset()
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
        this.setSelectedFeature(feature)
      }
      this.reset()
    },

    onSubmit(searchText: string) {
      this.searchText = searchText

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

        const projectTheme = `project_theme=${this.$vidoConfig().API_PROJECT}-${
          this.$vidoConfig().API_THEME
        }`
        const searchText = this.searchText.trim()
        if (searchText.length === 2) {
          const cartocode = this.searchText
          getPoiById(
            this.$vidoConfig().API_ENDPOINT,
            this.$vidoConfig().API_PROJECT,
            this.$vidoConfig().API_THEME,
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
            `${
              this.$vidoConfig().API_SEARCH
            }?${projectTheme}&type=menu_item&${query}`
          ).then((data) => (data.ok ? data.json() : null))

          const poisFetch: Promise<ApiSearchResult<ApiPoisSearchResult>> =
            fetch(
              `${
                this.$vidoConfig().API_SEARCH
              }?${projectTheme}&type=poi&${query}&limit=10`
            ).then((data) => (data.ok ? data.json() : null))

          const addressesFetch: Promise<ApiSearchResult<ApiAddrSearchResult>> =
            fetch(`${this.$vidoConfig().API_SEARCH_ADDR}?${query}`).then(
              (data) => (data.ok ? data.json() : null)
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

<style scoped>
.search-results {
  height: auto;
  overflow-y: auto;
  max-height: calc(100vh - 168px);
}
</style>
