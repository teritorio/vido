import copy from 'fast-copy'
import { deepEqual } from 'fast-equals'
import { defineStore } from 'pinia'
import type { ApiMenuCategory, ApiMenuResponse } from '~/types/api/menu'
import type { MenuGroup, MenuItem } from '~/types/local/menu'
import type { ApiPois } from '~/lib/apiPois'
import type { ApiPoi } from '~/types/api/poi'
import { getPoiByCategoryId } from '~/lib/apiPois'
import type { FilterValues } from '~/utils/types-filters'
import { filterValueFactory, filterValuesIsSet, isMatch, isSet } from '~/utils/types-filters'

interface FetchFeaturesPayload {
  categoryIds: ApiMenuCategory['id'][]
  clipingPolygonSlug?: string
}

function sortedUniq<T>(a: T[]): T[] {
  return [...new Set(a)].sort()
}

function keepFeature(filters: FilterValues, feature: ApiPoi): boolean {
  return filters.reduce<boolean>((prevValue, filter) => {
    return prevValue && (!isSet(filter) || isMatch(filter, feature.properties))
  }, true)
}

export const menuStore = defineStore('menu', () => {
  const menuItems = ref<Record<number, MenuItem>>()
  const selectedCategoryIds = ref<ApiMenuCategory['id'][]>([])
  const features = ref<Record<number, ApiPoi[]>>({})
  const filters = ref<Record<ApiMenuCategory['id'], FilterValues>>({})
  const allFeatures = ref<Record<number, ApiPoi[]>>({})
  const isLoadingFeatures = ref<boolean>(false)

  const getFeatureById = computed(() => {
    return (id: number): ApiPoi | undefined => {
      for (const key in allFeatures.value) {
        for (const feature of allFeatures.value[key]) {
          if (feature.properties.metadata.id === id) {
            return feature
          }
        }
      }
      return undefined
    }
  })

  const featuresColor = computed(() => {
    const colors = Object.values(features.value)
      .flat()
      .filter(feature => feature.properties.display)
      .map(feature => feature.properties.display!.color_fill)
    return [...new Set(colors)]
  })

  const apiMenuCategory = computed((): ApiMenuCategory[] | undefined => {
    return menuItems.value === undefined
      ? undefined
      : (Object.values(menuItems.value).filter(
          menuItem => 'category' in menuItem,
        ) as ApiMenuCategory[])
  })

  const getCurrentCategory = computed((): (categoryId: number) => ApiMenuCategory | undefined => {
    return (categoryId) => {
      return menuItems.value === undefined
        ? undefined
        : Object.values(menuItems.value).find(
          menuItem => menuItem.id === categoryId,
        ) as ApiMenuCategory
    }
  })

  const selectedCategories = computed((): ApiMenuCategory[] | undefined => {
    return menuItems.value === undefined
      ? undefined
      : (selectedCategoryIds.value
          .map(selectedCatagoryId => menuItems.value![selectedCatagoryId])
          .filter(
            menuItems => menuItems !== undefined,
          ) as ApiMenuCategory[])
  })

  function setSelectedCategoryIds(ids: ApiMenuCategory['id'][]) {
    selectedCategoryIds.value = ids
  }

  function addSelectedCategoryIds(ids: ApiMenuCategory['id'][]) {
    selectedCategoryIds.value = sortedUniq([
      ...selectedCategoryIds.value,
      ...ids,
    ])
  }

  function delSelectedCategoryIds(ids: ApiMenuCategory['id'][]) {
    selectedCategoryIds.value = selectedCategoryIds.value.filter(
      categoryId => !ids.includes(categoryId),
    )
  }

  function clearSelectedCategoryIds() {
    selectedCategoryIds.value = []
  }

  function toggleSelectedCategoryId(categoryId: ApiMenuCategory['id']) {
    if (selectedCategoryIds.value.includes(categoryId)) {
      selectedCategoryIds.value = selectedCategoryIds.value.filter(
        id => id !== categoryId,
      )
    }
    else {
      selectedCategoryIds.value = sortedUniq([
        ...selectedCategoryIds.value,
        categoryId,
      ])
    }
  }

  function fetchConfig(items: ApiMenuResponse) {
    try {
      const stateMenuItems: Record<number, MenuItem> = {}
      const localFilters: Record<number, FilterValues> = {}
      const { contribMode } = useContrib()

      menuItems.value = undefined // Hack, release from store before edit and reappend
      items
        .filter(menuItem => contribMode ? true : !menuItem.hidden)
        .map((menuItem) => {
          if ('menu_group' in menuItem) {
            const groupItem = {
              ...menuItem,
              menu_group: {
                ...menuItem.menu_group,
                vido_children: [],
              },
            } as MenuGroup

            stateMenuItems[menuItem.id] = groupItem
            return groupItem
          }
          else {
            stateMenuItems[menuItem.id] = menuItem
            return menuItem
          }
        })
        .forEach((menuItem: MenuItem) => {
          // Separated from previous map to allow batch processing and make sure parent category is always there
          // Associate to parent_id
          if (menuItem.parent_id) {
            const parent = stateMenuItems[menuItem.parent_id]

            if ('menu_group' in parent) {
              parent.menu_group.vido_children.push(menuItem.id)
            }
          }

          if ('category' in menuItem && menuItem.category.filters) {
            localFilters[menuItem.id] = menuItem.category.filters.map(filter => filterValueFactory(filter))
          }
        })

      menuItems.value = stateMenuItems
      filters.value = localFilters
    }
    catch (error) {
      console.error(
        'Vido error: Unable to fetch the menu config from the API',
        error,
      )
    }
  }

  async function fetchFeatures({ categoryIds, clipingPolygonSlug }: FetchFeaturesPayload) {
    isLoadingFeatures.value = true

    try {
      const previousFeatures = allFeatures.value
      const existingFeatures = categoryIds.map(categoryId =>
        Boolean(previousFeatures[categoryId]),
      )

      const posts: ApiPois[] = (
        await Promise.all(
          categoryIds
            .filter(categoryId => !previousFeatures[categoryId])
            .map((categoryId) => {
              try {
                let options = {}
                if (clipingPolygonSlug)
                  options = { cliping_polygon_slug: clipingPolygonSlug }
                return getPoiByCategoryId(categoryId, options)
              }
              catch (e) {
                console.error('Vido error:', e)
                return undefined
              }
            })
            .filter(apiPoi => !!apiPoi),
        )
      ).filter(e => e) as ApiPois[]

      const localFeatures: Record<number, ApiPoi[]> = {}

      let i = 0

      for (let j = 0; j < categoryIds.length; j++) {
        const categoryId = categoryIds[j]

        const filterIsSet = filters.value[categoryId] && filterValuesIsSet(filters.value[categoryId])

        if (existingFeatures[j]) {
          localFeatures[categoryId] = previousFeatures[categoryId].map(
            (f: ApiPoi) => ({
              ...f,
              properties: {
                ...f.properties,
                vido_visible:
                  !filterIsSet || keepFeature(filters.value[categoryId], f),
              },
            }),
          )
        }
        else {
          const post = posts[i]

          localFeatures[categoryId] = post.features.map((f) => {
            f.properties.vido_cat = categoryId
            f.properties.vido_visible
              = !filterIsSet || keepFeature(filters.value[categoryId], f)
            return f
          })

          i++
        }
      }

      features.value = localFeatures
      allFeatures.value = { ...allFeatures.value, ...features.value }
    }
    catch (error) {
      console.error(
        'Vido error: Unable to fetch the features from the API',
        error,
      )
    }
    finally {
      isLoadingFeatures.value = false
    }
  }

  // TODO: Maybe merge filterDeps with fetchFeatures
  // Check potential side-effects in components calling fetchFeatures
  function filterByDeps(categoryId: number, deps: ApiPoi[]) {
    if (deps.length <= 1)
      return

    const filteredFeatures: { [key: number]: ApiPoi[] } = {}
    filteredFeatures[categoryId] = deps
    features.value = filteredFeatures
  }

  function applyFilters({
    categoryId,
    filterValues,
  }: {
    categoryId: number
    filterValues: FilterValues
  }) {
    const newFilters = copy(filters.value)
    if (!deepEqual(newFilters[categoryId], filterValues)) {
      newFilters[categoryId] = filterValues
      filters.value = newFilters

      // Update features visibility
      if (categoryId in features.value) {
        const localFeatures: { [categoryId: number]: ApiPoi[] } = copy(features.value)
        const filterIsSet = filterValuesIsSet(filterValues)

        localFeatures[categoryId] = localFeatures[categoryId].map((feature: ApiPoi) => {
          feature.properties.vido_visible
            = !filterIsSet || keepFeature(filterValues, feature)
          return feature
        })

        features.value = localFeatures
      }
    }
  }

  return {
    menuItems,
    selectedCategoryIds,
    features,
    filters,
    allFeatures,
    isLoadingFeatures,
    getFeatureById,
    featuresColor,
    apiMenuCategory,
    getCurrentCategory,
    selectedCategories,
    setSelectedCategoryIds,
    addSelectedCategoryIds,
    delSelectedCategoryIds,
    clearSelectedCategoryIds,
    toggleSelectedCategoryId,
    fetchConfig,
    fetchFeatures,
    filterByDeps,
    applyFilters,
  }
})
