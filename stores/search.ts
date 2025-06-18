import { defineStore, storeToRefs } from 'pinia'
import { debounce } from 'lodash'
import copy from 'fast-copy'
import { useSiteStore } from '~/stores/site'
import { menuStore as useMenuStore } from '~/stores/menu'
import type { MenuItem } from '~/lib/apiMenu'
import { type ApiPoi, getPoiById } from '~/lib/apiPois'
import type { ApiAddrSearchResult, ApiMenuItemSearchResult, ApiPoisSearchResult, ApiSearchResult, SearchResult } from '~/lib/apiSearch'
import { mapStore as useMapStore } from '~/stores/map'

export const useSearchStore = defineStore('search', () => {
  const { $tracking } = useNuxtApp()
  const { config } = storeToRefs(useSiteStore())
  const menuStore = useMenuStore()
  const { filters, apiMenuCategory } = storeToRefs(menuStore)
  const { center } = storeToRefs(useMapStore())

  if (!config.value)
    throw createError({ statusCode: 500, statusMessage: 'Wrong config', fatal: true })

  const { API_PROJECT, API_THEME, API_SEARCH, API_ADDR } = config.value
  const focus = ref(false)
  const searchText = ref('')
  const searchResultId = ref(0)
  const searchQueryId = ref(0)
  const searchSelectedFeature = ref<ApiPoi | null>(null)

  const searchMenuItemsResults = ref<ApiSearchResult<ApiMenuItemSearchResult> | null>(null)
  const searchPoisResults = ref<ApiSearchResult<ApiPoisSearchResult> | null>(null)
  const searchAddressesResults = ref<ApiSearchResult<ApiAddrSearchResult> | null>(null)
  const searchCartocodeResult = ref<ApiPoi | null>(null)

  const isLoading = computed(() => {
    return searchResultId.value !== searchQueryId.value
  })

  const menuItemsToIcons = computed(() => {
    const resources: Record<MenuItem['id'], string> = {}
    Object.values(apiMenuCategory.value || {}).forEach((sc) => {
      resources[sc.id] = (sc.menu_group || sc.link || sc.category).icon
    })
    return resources
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
        icon: menuItemsToIcons.value[v.properties.id],
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

  function reset() {
    searchMenuItemsResults.value = null
    searchPoisResults.value = null
    searchAddressesResults.value = null
    searchCartocodeResult.value = null
    searchText.value = ''
    focus.value = false
  }

  function submit(event: Event): void {
    searchText.value = (event.target as HTMLInputElement).value

    // Reset results if empty search text
    if (!searchText.value || searchText.value.trim().length === 0) {
      searchMenuItemsResults.value = null
      searchPoisResults.value = null
      searchAddressesResults.value = null
      searchCartocodeResult.value = null
    }

    // Launch search if not already loading + search text length >= 3
    if (!isLoading.value && searchText.value.trim().length >= 3)
      performSearch()
  }

  function onFocus() {
    focus.value = true
  }

  function delayedFocusLose() {
  // Let time to catch click on results before hiden
    setTimeout(() => {
      focus.value = false
    }, 200)
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

  async function onPoiClick(searchResult: SearchResult) {
    const poi = await getPoiById(config.value!, searchResult.id)
    searchSelectedFeature.value = poi
    reset()
  }

  function onAddressClick(searchResult: SearchResult) {
    const feature = (searchAddressesResults.value?.features || []).find(
      a => a.properties.id === searchResult.id,
    )
    if (feature) {
      const f = formatApiAddressToFeature(feature, true)
      searchSelectedFeature.value = f
    }
    reset()
  }

  const trackSearchQuery = debounce((query: string) => {
    $tracking({ type: 'search_query', query })
  }, 3000)

  async function performSearch() {
    if (!searchText.value.trim())
      return

    trackSearchQuery.cancel()
    trackSearchQuery(searchText.value)

    searchQueryId.value += 1
    const currentSearchQueryId = searchQueryId.value
    const projectTheme = `project_theme=${API_PROJECT}-${API_THEME}`
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
      const query = `q=${searchText.value}&lon=${center.value.lng}&lat=${center.value.lat}`
      const MenuItemsFetch: Promise<ApiSearchResult<ApiMenuItemSearchResult>> = fetch(`${API_SEARCH}?${projectTheme}&type=menu_item&${query}`)
        .then(data => (data.ok ? data.json() : null))

      const poisFetch: Promise<ApiSearchResult<ApiPoisSearchResult>> = fetch(`${API_SEARCH}?${projectTheme}&type=poi&${query}&limit=10`)
        .then(data => (data.ok ? data.json() : null))

      const addressesFetch: Promise<ApiSearchResult<ApiAddrSearchResult>> = fetch(`${API_ADDR}/search?${query}`)
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

  const search = debounce(performSearch, 300)
  function dispose() {
    search.cancel()
    trackSearchQuery.cancel()
  }

  return {
    searchText,
    isLoading,
    focus,
    itemsCartocode,
    itemsMenuItems,
    itemsPois,
    itemsAddresses,
    searchSelectedFeature,
    onCartocodeClick,
    onCategoryClick,
    onPoiClick,
    onAddressClick,
    reset,
    submit,
    delayedFocusLose,
    dispose,
    onFocus,
  }
})
