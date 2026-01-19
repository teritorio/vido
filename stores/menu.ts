import copy from 'fast-copy'
import { deepEqual } from 'fast-equals'
import { defineStore } from 'pinia'
import type { ApiFieldsList, ApiFieldsListGroup, ApiFieldsListItem } from '~/types/api/field'
import type { ApiMenuCategory, ApiMenuCollection } from '~/types/api/menu'
import type { MenuCategory, MenuCategoryEditorial, MenuGroup, MenuItem } from '~/types/local/menu'
import type { ApiPoiCollection } from '~/types/api/poi'
import { getPoiByCategoryId } from '~/lib/apiPois'
import type { FilterValues } from '~/utils/types-filters'
import { filterValueFactory, filterValuesIsSet, isMatch, isSet } from '~/utils/types-filters'
import type { Poi } from '~/types/local/poi'
import type { PoiUnion } from '~/types/local/poi-deps'
import type { FieldsList, FieldsListGroup, FieldsListItem } from '~/types/local/field'

interface FetchFeaturesPayload {
  categoryIds: ApiMenuCategory['id'][]
  clipingPolygonSlug?: string
}

function sortedUniq<T>(a: T[]): T[] {
  return [...new Set(a)].sort()
}

function transformApiFieldsListItem(item: ApiFieldsListItem): FieldsListItem {
  return {
    ...item,
    field: item.field.join('.'),
  }
}

function transformApiFieldsListGroup(group: ApiFieldsListGroup): FieldsListGroup {
  return {
    ...group,
    fields: transformApiFieldsList(group.fields) || [],
  }
}

function transformApiFieldsList(fields: ApiFieldsList | undefined): FieldsList | undefined {
  if (!fields)
    return undefined

  return fields.map((item) => {
    if ('group' in item)
      return transformApiFieldsListGroup(item)

    return transformApiFieldsListItem(item)
  })
}

function transformCategoryEditorial(editorial: ApiMenuCategory['category']['editorial'] | undefined): MenuCategoryEditorial | undefined {
  if (!editorial)
    return undefined

  return {
    ...editorial,
    popup_fields: transformApiFieldsList(editorial.popup_fields),
    details_fields: transformApiFieldsList(editorial.details_fields),
    list_fields: transformApiFieldsList(editorial.list_fields),
  }
}

function transformApiMenuCategory(menuItem: ApiMenuCategory): MenuCategory {
  return {
    ...menuItem,
    category: {
      ...menuItem.category,
      editorial: transformCategoryEditorial(menuItem.category.editorial),
    },
  }
}

function keepFeature(filters: FilterValues, feature: Poi): boolean {
  return filters.reduce<boolean>((prevValue, filter) => {
    return prevValue && (!isSet(filter) || isMatch(filter, feature.properties))
  }, true)
}

export const menuStore = defineStore('menu', () => {
  const menuItems = ref<Record<number, MenuItem>>()
  const selectedCategoryIds = ref<ApiMenuCategory['id'][]>([])
  const features = ref<Record<number, Poi[]>>({})
  const filters = ref<Record<ApiMenuCategory['id'], FilterValues>>({})
  const allFeatures = ref<Record<number, Poi[]>>({})
  const isLoadingFeatures = ref<boolean>(false)
  const poiCompo = usePoi()

  const getFeatureById = computed(() => {
    return (id: number): Poi | undefined => {
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
      .map(feature => feature.properties.display.color_fill)
      .filter(Boolean) as string[]

    return [...new Set(colors)]
  })

  const apiMenuCategory = computed((): MenuCategory[] | undefined => {
    return menuItems.value === undefined
      ? undefined
      : (Object.values(menuItems.value).filter(
          menuItem => 'category' in menuItem,
        ) as MenuCategory[])
  })

  const getCurrentCategory = computed((): (categoryId: number) => MenuCategory | undefined => {
    return (categoryId) => {
      return menuItems.value === undefined
        ? undefined
        : Object.values(menuItems.value).find(
          menuItem => menuItem.id === categoryId,
        ) as MenuCategory
    }
  })

  const selectedCategories = computed((): MenuCategory[] | undefined => {
    return menuItems.value === undefined
      ? undefined
      : (selectedCategoryIds.value
          .map(selectedCatagoryId => menuItems.value![selectedCatagoryId])
          .filter(
            menuItems => menuItems !== undefined,
          ) as MenuCategory[])
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

  function fetchConfig(items: ApiMenuCollection) {
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
          else if ('category' in menuItem) {
            const categoryItem = transformApiMenuCategory(menuItem)
            stateMenuItems[menuItem.id] = categoryItem
            return categoryItem
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

            if (parent && 'menu_group' in parent) {
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

      const posts = (
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
      ).filter(e => e) as ApiPoiCollection[]

      const localFeatures: Record<number, Poi[]> = {}

      let i = 0

      for (let j = 0; j < categoryIds.length; j++) {
        const categoryId = categoryIds[j]

        const filterIsSet = filters.value[categoryId] && filterValuesIsSet(filters.value[categoryId])

        if (existingFeatures[j]) {
          localFeatures[categoryId] = previousFeatures[categoryId].map(
            (f: Poi) => {
              f.properties.vido_visible = !filterIsSet || keepFeature(filters.value[categoryId], f)
              return f
            },
          )
        }
        else {
          localFeatures[categoryId] = posts[i].features.map((f) => {
            const category = getCurrentCategory.value(categoryId)

            if (!category)
              throw new Error(`Category not found for feature ${f.properties.metadata.id}.`)

            const poi = poiCompo.formatPoi(f, category)
            poi.properties.vido_cat = categoryId
            poi.properties.vido_visible = !filterIsSet || keepFeature(filters.value[categoryId], poi)
            return poi
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
  function filterByDeps(categoryId: number, deps: PoiUnion[]) {
    if (deps.length <= 1)
      return

    const filteredFeatures: { [key: number]: PoiUnion[] } = {}
    filteredFeatures[categoryId] = deps
    features.value = filteredFeatures as Record<number, Poi[]>
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
        const localFeatures: { [categoryId: number]: Poi[] } = copy(features.value)
        const filterIsSet = filterValuesIsSet(filterValues)

        localFeatures[categoryId] = localFeatures[categoryId].map((feature: Poi) => {
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
