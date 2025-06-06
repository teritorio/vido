<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import copy from 'fast-copy'
import type { DebouncedFunc } from 'lodash'
import { debounce } from 'lodash'
import { mapActions, mapState, storeToRefs } from 'pinia'
import type { PropType } from 'vue'
import { defineNuxtComponent } from '#app'
import SearchInput from '~/components/Search/SearchInput.vue'
import SearchResultBlock from '~/components/Search/SearchResultBlock.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { getPoiById } from '~/lib/apiPois'
import type {
  ApiAddrSearchResult,
  ApiMenuItemSearchResult,
  ApiPoisSearchResult,
  ApiSearchResult,
  SearchResult,
} from '~/lib/apiSearch'
import { menuStore } from '~/stores/menu'
import type { FilterValue } from '~/utils/types-filters'
import { useSiteStore } from '~/stores/site'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    SearchInput,
    SearchResultBlock,
  },

  props: {
    menuToIcon: {
      type: Object as PropType<{ [id: string]: string }>,
      required: true,
    },
    mapCenter: {
      type: Object as PropType<{ lng: number, lat: number }>,
      default: () => ({ lng: 0, lat: 0 }),
    },
  },

  setup() {
    const { config } = storeToRefs(useSiteStore())

    return {
      config,
    }
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
    ...mapState(menuStore, ['filters']),

    isLoading(): boolean {
      return this.searchResultId !== this.searchQueryId
    },

    itemsCartocode(): SearchResult[] {
      const v = this.searchCartocodeResult
      if (v && v.properties.metadata?.id) {
        const { featureName } = useFeature(toRef(v), { type: 'popup' })

        if (featureName.value) {
          return [{
            id: v.properties.metadata?.id,
            label: featureName.value,
          }]
        }
      }

      return []
    },

    itemsMenuItems(): SearchResult[] {
      return (
        this.searchMenuItemsResults?.features?.map(v => ({
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
        this.searchPoisResults?.features?.map(v => ({
          id: v.properties.id,
          label: v.properties.label,
          icon: v.properties.icon,
          small: v.properties.city,
        })) || []
      )
    },

    itemsAddresses(): SearchResult[] {
      return (
        this.searchAddressesResults?.features?.map(v => ({
          id: v.properties.id,
          label: v.properties.label,
          icon:
            v.properties.type === 'municipality' ? 'city' : 'map-marker-alt',
        })) || []
      )
    },

    results(): number {
      return (
        this.itemsCartocode.length
        + this.itemsMenuItems.length
        + this.itemsPois.length
        + this.itemsAddresses.length
      )
    },
  },

  created() {
    this.search = debounce(this.search_, 300)
    this.trackSearchQuery = debounce(this.trackSearchQuery_, 3000)
  },

  emits: {
    blur: (_event: FocusEvent) => true,
    focus: (_event: string | Event) => true,
    selectFeature: (_feature: ApiPoi) => true,
  },

  methods: {
    ...mapActions(menuStore, ['addSelectedCategoryIds', 'applyFilters']),

    reset() {
      this.searchMenuItemsResults = null
      this.searchPoisResults = null
      this.searchAddressesResults = null
      this.searchCartocodeResult = null
      this.searchText = ''
      this.focus = false
    },

    delayedFocusLose(event: FocusEvent) {
      // Let time to catch click on results before hiden
      setTimeout(() => {
        this.$emit('blur', event)
        this.focus = false
      }, 200)
    },

    onSearchFocus(event: string | Event) {
      this.$emit('focus', event)
      this.focus = true
    },

    onCartocodeClick(searchResult: SearchResult) {
      const cartocodeId = this.searchCartocodeResult?.properties.metadata?.id
      if (cartocodeId === searchResult.id)
        this.onPoiClick(searchResult)
    },

    onCategoryClick(category: SearchResult) {
      if (this.searchMenuItemsResults) {
        const filter = this.searchMenuItemsResults.features.find(
          a =>
            a.properties.filter_property === category.filter_property
            && a.properties.filter_value === category.filter_value
            && a.properties.id === category.id,
        )

        if (filter?.properties) {
          const newFilter = filter.properties
          if (newFilter.filter_property) {
            const filters = copy(this.filters[newFilter.id])
            const filter = filters.find(
              (filter: FilterValue) =>
                (filter.type === 'boolean'
                || filter.type === 'multiselection'
                || filter.type === 'checkboxes_list')
                && filter.def.property === newFilter.filter_property,
            )
            if (filter) {
              switch (filter?.type) {
                case 'boolean':
                  if (newFilter.filter_value === true)
                    filter.filterValue = newFilter.filter_value

                  break
                case 'multiselection':
                case 'checkboxes_list':
                  filter.filterValues = [newFilter.filter_value as string]
                  break
              }

              this.applyFilters({
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

    onPoiClick(searchResult: SearchResult) {
      getPoiById(this.config!, searchResult.id).then(
        (poi) => {
          this.$emit('selectFeature', poi)
        },
      )

      this.reset()
    },

    onAddressClick(searchResult: SearchResult) {
      const feature = (this.searchAddressesResults?.features || []).find(
        a => a.properties.id === searchResult.id,
      )
      if (feature) {
        const f = formatApiAddressToFeature(feature, true)
        this.$emit('selectFeature', f)
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
      if (this.search)
        this.search()
    },

    search_() {
      if (this.searchText) {
        if (this.trackSearchQuery) {
          this.trackSearchQuery.cancel()
          this.trackSearchQuery(this.searchText)
        }

        this.searchQueryId += 1
        const currentSearchQueryId = this.searchQueryId
        const projectTheme = `project_theme=${this.config!.API_PROJECT}-${this.config!.API_THEME}`
        const searchText = this.searchText.trim()
        if (searchText.length === 2) {
          const cartocode = this.searchText
          getPoiById(this.config!, `cartocode:${cartocode}`)
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
        }
        else if (searchText.length > 2) {
          const query = `q=${this.searchText}&lon=${this.mapCenter.lng}&lat=${this.mapCenter.lat}`
          const MenuItemsFetch: Promise<ApiSearchResult<ApiMenuItemSearchResult>> = fetch(`${this.config!.API_SEARCH}?${projectTheme}&type=menu_item&${query}`)
            .then(data => (data.ok ? data.json() : null))

          const poisFetch: Promise<ApiSearchResult<ApiPoisSearchResult>> = fetch(`${this.config!.API_SEARCH}?${projectTheme}&type=poi&${query}&limit=10`)
            .then(data => (data.ok ? data.json() : null))

          const addressesFetch: Promise<ApiSearchResult<ApiAddrSearchResult>> = fetch(`${this.config!.API_ADDR}/search?${query}`)
            .then(data => data.ok ? data.json() : null)

          Promise.all([MenuItemsFetch, poisFetch, addressesFetch])
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
              },
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

<template>
  <div>
    <div class="tw-flex tw-flex-row tw-items-center">
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
      class="tw-shrink-0 tw-w-10 tw-h-10 tw-text-2xl tw-font-bold tw-transition-all tw-rounded-full tw-outline-none tw-cursor-pointer focus:tw-outline-none hover:tw-bg-zinc-10"
      @click="reset"
    >
      <FontAwesomeIcon icon="arrow-left" class="tw-text-zinc-800" size="xs" />
    </button>

    <div v-if="focus && results > 0" class="search-results">
      <SearchResultBlock
        v-if="itemsCartocode.length > 0"
        type="cartocode"
        :label="$t('headerMenu.cartocode')"
        icon="layer-group"
        :items="itemsCartocode"
        @item-click="onCartocodeClick"
      />

      <SearchResultBlock
        v-if="itemsMenuItems.length > 0"
        type="category"
        :label="$t('headerMenu.categories')"
        icon="layer-group"
        :items="itemsMenuItems"
        @item-click="onCategoryClick"
      />

      <SearchResultBlock
        v-if="itemsPois.length > 0"
        type="pois"
        :label="$t('headerMenu.pois')"
        icon="map-marker-alt"
        :items="itemsPois"
        @item-click="onPoiClick"
      />

      <SearchResultBlock
        v-if="itemsAddresses.length > 0"
        type="addresse"
        :label="$t('headerMenu.addresses')"
        icon="home"
        :items="itemsAddresses"
        @item-click="onAddressClick"
      />

      <p v-if="results === 0">
        {{ $t('headerMenu.noResult') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.search-results {
  height: auto;
  overflow-y: auto;
  max-height: calc(100vh - 185px);
}
</style>
