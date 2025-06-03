<script setup lang="ts">
import copy from 'fast-copy'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import type { DebouncedFunc } from 'lodash'
import type { ApiPoi } from '~/lib/apiPois'
import type { FilterValue } from '~/utils/types-filters'
import type {
  ApiAddrSearchResult,
  ApiMenuItemSearchResult,
  ApiPoisSearchResult,
  ApiSearchResult,
  SearchResult,
} from '~/lib/apiSearch'
import SearchInput from '~/components/Search/SearchInput.vue'
import SearchResultBlock from '~/components/Search/SearchResultBlock.vue'
import { getPoiById } from '~/lib/apiPois'
import { menuStore as useMenuStore } from '~/stores/menu'
import { useSiteStore } from '~/stores/site'

const props = withDefaults(defineProps<{
  menuToIcon: { [id: string]: string }
  mapCenter: { lng: number, lat: number }
}>(), {
  mapCenter: () => ({ lng: 0, lat: 0 }),
})

const emit = defineEmits<{
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: string | Event): void
  (e: 'selectFeature', feature: ApiPoi): void
}>()

const { config } = storeToRefs(useSiteStore())
const menuStore = useMenuStore()
const { filters } = storeToRefs(menuStore)
const { $tracking } = useNuxtApp()
const { t } = useI18n()

const focus = ref(false)
const searchQueryId = ref(0)
const searchResultId = ref(0)
const searchText = ref('')
const searchMenuItemsResults = ref<ApiSearchResult<ApiMenuItemSearchResult> | null>(null)
const searchPoisResults = ref<ApiSearchResult<ApiPoisSearchResult> | null>(null)
const searchAddressesResults = ref<ApiSearchResult<ApiAddrSearchResult> | null>(null)
const searchCartocodeResult = ref<ApiPoi | null>(null)
const search = ref<DebouncedFunc<() => void> | null>(null)
const trackSearchQuery = ref<DebouncedFunc<(query: string) => void> | null>(null)

onMounted(() => {
  search.value = debounce(search_, 300)
  trackSearchQuery.value = debounce(trackSearchQuery_, 3000)
})

onUnmounted(() => {
  search.value?.cancel()
  trackSearchQuery.value?.cancel()
})

const isLoading = computed(() => {
  return searchResultId.value !== searchQueryId.value
})

const itemsCartocode = computed(() => {
  const v = searchCartocodeResult.value
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
})

const itemsMenuItems = computed(() => {
  return (
    searchMenuItemsResults.value?.features?.map(v => ({
      id: v.properties.id,
      label: v.properties.label,
      icon: props.menuToIcon[v.properties.id],
      filter_property: v.properties.filter_property,
      filter_value: v.properties.filter_value,
    })) || []
  )
})

const itemsPois = computed(() => {
  return (
    searchPoisResults.value?.features?.map(v => ({
      id: v.properties.id,
      label: v.properties.label,
      icon: v.properties.icon,
      small: v.properties.city,
    })) || []
  )
})

const itemsAddresses = computed(() => {
  return (
    searchAddressesResults.value?.features?.map(v => ({
      id: v.properties.id,
      label: v.properties.label,
      icon: v.properties.type === 'municipality' ? 'city' : 'map-marker-alt',
    })) || []
  )
})

const results = computed(() => {
  return (
    itemsCartocode.value.length
    + itemsMenuItems.value.length
    + itemsPois.value.length
    + itemsAddresses.value.length
  )
})

function reset() {
  searchMenuItemsResults.value = null
  searchPoisResults.value = null
  searchAddressesResults.value = null
  searchCartocodeResult.value = null
  searchText.value = ''
  focus.value = false
}

function delayedFocusLose(event: FocusEvent) {
  // Let time to catch click on results before hiden
  setTimeout(() => {
    emit('blur', event)
    focus.value = false
  }, 200)
}

function onSearchFocus(event: string | Event) {
  emit('focus', event)
  focus.value = true
}

function onCartocodeClick(searchResult: SearchResult) {
  const cartocodeId = searchCartocodeResult.value?.properties.metadata?.id
  if (cartocodeId === searchResult.id)
    onPoiClick(searchResult)
}

function onCategoryClick(category: SearchResult) {
  if (searchMenuItemsResults.value) {
    const filter = searchMenuItemsResults.value.features.find(
      a =>
        a.properties.filter_property === category.filter_property
        && a.properties.filter_value === category.filter_value
        && a.properties.id === category.id,
    )

    if (filter?.properties) {
      const newFilter = filter.properties
      if (newFilter.filter_property) {
        const newFilters = copy(filters.value[newFilter.id])
        const filter = newFilters.find(
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

          menuStore.applyFilters({
            categoryId: newFilter.id,
            filterValues: newFilters,
          })
        }
      }

      menuStore.addSelectedCategoryIds([newFilter.id])

      reset()
    }
  }
}

function onPoiClick(searchResult: SearchResult) {
  getPoiById(config.value!, searchResult.id).then(
    poi => emit('selectFeature', poi),
  )

  reset()
}

function onAddressClick(searchResult: SearchResult) {
  const feature = (searchAddressesResults.value?.features || []).find(
    a => a.properties.id === searchResult.id,
  )
  if (feature) {
    const f = formatApiAddressToFeature(feature, true)
    emit('selectFeature', f)
  }
  reset()
}

function onSubmit(query: string) {
  searchText.value = query

  // Reset results if empty search text
  if (!searchText.value || searchText.value.trim().length === 0) {
    searchMenuItemsResults.value = null
    searchPoisResults.value = null
    searchAddressesResults.value = null
    searchCartocodeResult.value = null
  }

  // Launch search if not already loading + search text length >= 3
  if (search.value)
    search_()
}

function search_() {
  if (searchText.value) {
    if (trackSearchQuery.value) {
      trackSearchQuery.value.cancel()
      trackSearchQuery_(searchText.value)
    }

    searchQueryId.value += 1
    const currentSearchQueryId = searchQueryId.value
    const projectTheme = `project_theme=${config.value!.API_PROJECT}-${config.value!.API_THEME}`
    const searchValue = searchText.value.trim()
    if (searchValue.length === 2) {
      const cartocode = searchText.value
      getPoiById(config.value!, `cartocode:${cartocode}`)
        .then((poi) => {
          if (currentSearchQueryId > searchResultId.value) {
            searchResultId.value = currentSearchQueryId
            searchMenuItemsResults.value = null
            searchPoisResults.value = null
            searchAddressesResults.value = null
            searchCartocodeResult.value = poi
          }
        })
        .catch(() => {
          // Deals with 404 and error from API
          if (currentSearchQueryId > searchResultId.value) {
            searchResultId.value = currentSearchQueryId
            searchMenuItemsResults.value = null
            searchPoisResults.value = null
            searchAddressesResults.value = null
            searchCartocodeResult.value = null
          }
        })
    }
    else if (searchValue.length > 2) {
      const query = `q=${searchText.value}&lon=${props.mapCenter.lng}&lat=${props.mapCenter.lat}`
      const MenuItemsFetch: Promise<ApiSearchResult<ApiMenuItemSearchResult>> = fetch(`${config.value!.API_SEARCH}?${projectTheme}&type=menu_item&${query}`)
        .then(data => (data.ok ? data.json() : null))

      const poisFetch: Promise<ApiSearchResult<ApiPoisSearchResult>> = fetch(`${config.value!.API_SEARCH}?${projectTheme}&type=poi&${query}&limit=10`)
        .then(data => (data.ok ? data.json() : null))

      const addressesFetch: Promise<ApiSearchResult<ApiAddrSearchResult>> = fetch(`${config.value!.API_ADDR}/search?${query}`)
        .then(data => data.ok ? data.json() : null)

      Promise.all([MenuItemsFetch, poisFetch, addressesFetch])
        .then(
          ([
            menuItems,
            pois,
            addresses,
          ]) => {
            if (currentSearchQueryId > searchResultId.value) {
              searchResultId.value = currentSearchQueryId
              searchMenuItemsResults.value = menuItems
              searchPoisResults.value = pois
              searchAddressesResults.value = addresses
              searchCartocodeResult.value = null
            }
          },
        )
        .catch(() => {
          // Deals with error from API
          if (currentSearchQueryId > searchResultId.value) {
            searchResultId.value = currentSearchQueryId
            searchMenuItemsResults.value = null
            searchPoisResults.value = null
            searchAddressesResults.value = null
            searchCartocodeResult.value = null
          }
        })
    }
  }
}

function trackSearchQuery_(searchText: string) {
  $tracking({ type: 'search_query', query: searchText })
}
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
        :label="t('headerMenu.cartocode')"
        icon="layer-group"
        :items="itemsCartocode"
        @item-click="onCartocodeClick"
      />

      <SearchResultBlock
        v-if="itemsMenuItems.length > 0"
        type="category"
        :label="t('headerMenu.categories')"
        icon="layer-group"
        :items="itemsMenuItems"
        @item-click="onCategoryClick"
      />

      <SearchResultBlock
        v-if="itemsPois.length > 0"
        type="pois"
        :label="t('headerMenu.pois')"
        icon="map-marker-alt"
        :items="itemsPois"
        @item-click="onPoiClick"
      />

      <SearchResultBlock
        v-if="itemsAddresses.length > 0"
        type="addresse"
        :label="t('headerMenu.addresses')"
        icon="home"
        :items="itemsAddresses"
        @item-click="onAddressClick"
      />

      <p v-if="results === 0">
        {{ t('headerMenu.noResult') }}
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.search-results {
  height: auto;
  overflow-y: auto;
  max-height: calc(100vh - 185px);
}
</style>
