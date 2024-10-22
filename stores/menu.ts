import copy from 'fast-copy'
import { deepEqual } from 'fast-equals'
import { defineStore } from 'pinia'
import { type ApiMenuCategory, type MenuItem, getMenu } from '~/lib/apiMenu'
import type { ApiPoi, ApiPois } from '~/lib/apiPois'
import { getPoiByCategoryId } from '~/lib/apiPois'
import type { VidoConfig } from '~/utils/types-config'
import type { FilterValues } from '~/utils/types-filters'
import { filterValueFactory, filterValuesIsSet, isMatch, isSet } from '~/utils/types-filters'

interface FetchFeaturesPayload {
  vidoConfig: VidoConfig
  categoryIds: ApiMenuCategory['id'][]
  clipingPolygonSlug?: string
}

export interface State {
  menuItems?: Record<number, MenuItem>
  selectedCategoryIds: ApiMenuCategory['id'][]
  features: {
    [key: number]: ApiPoi[]
  }
  allFeatures: {
    [key: number]: ApiPoi[]
  }
  filters: Record<ApiMenuCategory['id'], FilterValues>
  isLoadingFeatures: boolean
}

function sortedUniq<T>(a: T[]): T[] {
  return [...new Set(a)].sort()
}

function keepFeature(filters: FilterValues, feature: ApiPoi): boolean {
  return filters.reduce<boolean>((prevValue, filter) => {
    return prevValue && (!isSet(filter) || isMatch(filter, feature.properties))
  }, true)
}

export const menuStore = defineStore('menu', {
  state: (): State => ({
    menuItems: undefined,
    selectedCategoryIds: [],
    features: {},
    filters: {},
    allFeatures: {},
    isLoadingFeatures: false,
  }),

  getters: {
    apiMenuCategory: (state: State): ApiMenuCategory[] | undefined => {
      return state.menuItems === undefined
        ? undefined
        : (Object.values(state.menuItems).filter(
            menuItem => !!menuItem.category,
          ) as ApiMenuCategory[])
    },

    getCurrentCategory: (state: State): (categoryId: number) => ApiMenuCategory | undefined => {
      return (categoryId) => {
        return state.menuItems === undefined
          ? undefined
          : Object.values(state.menuItems).find(
            menuItem => menuItem.id === categoryId,
          ) as ApiMenuCategory
      }
    },

    selectedCategories: (state: State): ApiMenuCategory[] | undefined => {
      return state.menuItems === undefined
        ? undefined
        : (state.selectedCategoryIds
            .map(selectedCatagoryId => state.menuItems![selectedCatagoryId])
            .filter(
              menuItems => menuItems !== undefined,
            ) as ApiMenuCategory[])
    },
  },

  actions: {
    async init(config: VidoConfig) {
      const menuItems = await getMenu(config)
      this.fetchConfig(menuItems)
    },

    setSelectedCategoryIds(selectedCategoryIds: ApiMenuCategory['id'][]) {
      this.selectedCategoryIds = selectedCategoryIds
    },

    addSelectedCategoryIds(selectedCategoryIds: ApiMenuCategory['id'][]) {
      this.selectedCategoryIds = sortedUniq([
        ...this.selectedCategoryIds,
        ...selectedCategoryIds,
      ])
    },

    delSelectedCategoryIds(selectedCategoryIds: ApiMenuCategory['id'][]) {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(
        categoryId => !selectedCategoryIds.includes(categoryId),
      )
    },

    clearSelectedCategoryIds() {
      this.selectedCategoryIds = []
    },

    toggleSelectedCategoryId(categoryId: ApiMenuCategory['id']) {
      if (this.selectedCategoryIds.includes(categoryId)) {
        this.selectedCategoryIds = this.selectedCategoryIds.filter(
          id => id !== categoryId,
        )
      }
      else {
        this.selectedCategoryIds = sortedUniq([
          ...this.selectedCategoryIds,
          categoryId,
        ])
      }
    },

    fetchConfig(menuItems: MenuItem[]) {
      try {
        const stateMenuItems: State['menuItems'] = {}
        const filters: Record<ApiMenuCategory['id'], FilterValues> = {}
        const { contribMode } = useContrib()

        this.menuItems = undefined // Hack, release from store before edit and reappend
        menuItems
          .filter(menuItem => contribMode ? true : !menuItem.hidden)
          .map((menuItem) => {
            stateMenuItems[menuItem.id] = menuItem
            return menuItem
          })
          .forEach((menuItem) => {
            // Separated from previous map to allow batch processing and make sure parent category is always there
            // Associate to parent_id
            if (menuItem.parent_id && menuItem.parent_id !== null) {
              const parent = stateMenuItems[menuItem.parent_id]
              if (parent?.menu_group) {
                if (!parent.menu_group.vido_children)
                  parent.menu_group.vido_children = []

                parent.menu_group.vido_children.push(menuItem.id)
              }
            }

            if (menuItem.category?.filters) {
              filters[menuItem.id] = menuItem.category?.filters.map(filter =>
                filterValueFactory(filter),
              )
            }
          })
        this.menuItems = stateMenuItems
        this.filters = filters
      }
      catch (error) {
        console.error(
          'Vido error: Unable to fetch the menu config from the API',
          error,
        )
      }
    },

    async fetchFeatures({ vidoConfig, categoryIds, clipingPolygonSlug }: FetchFeaturesPayload) {
      this.isLoadingFeatures = true

      try {
        const previousFeatures = this.allFeatures
        const existingFeatures = categoryIds.map(categoryId =>
          Boolean(previousFeatures[categoryId]),
        )

        const posts: ApiPois[] = (
          await Promise.all(
            categoryIds
              .filter(categoryId => !previousFeatures[categoryId])
              .map((categoryId) => {
                try {
                  return getPoiByCategoryId(vidoConfig, categoryId, { cliping_polygon_slug: clipingPolygonSlug })
                }
                catch (e) {
                  // eslint-disable-next-line no-console
                  console.log('Vido error:', e)
                  return undefined
                }
              })
              .filter(apiPoi => !!apiPoi),
          )
        ).filter(e => e) as ApiPois[]

        const features: State['features'] = {}

        let i = 0

        for (let j = 0; j < categoryIds.length; j++) {
          const categoryId = categoryIds[j]

          const filterIsSet
            = this.filters[categoryId]
            && filterValuesIsSet(this.filters[categoryId])
          if (existingFeatures[j]) {
            features[categoryId] = previousFeatures[categoryId].map(
              (f: ApiPoi) => ({
                ...f,
                properties: {
                  ...f.properties,
                  vido_visible:
                    !filterIsSet || keepFeature(this.filters[categoryId], f),
                },
              }),
            )
          }
          else {
            const post = posts[i]

            features[categoryId] = post.features.map((f) => {
              f.properties.vido_cat = categoryId
              f.properties.vido_visible
                = !filterIsSet || keepFeature(this.filters[categoryId], f)
              return f
            })

            i++
          }
        }

        this.features = features
        this.allFeatures = { ...this.allFeatures, ...features }
      }
      catch (error) {
        console.error(
          'Vido error: Unable to fetch the features from the API',
          error,
        )
      }
      finally {
        this.isLoadingFeatures = false
      }
    },

    applyFilters({
      categoryId,
      filterValues,
    }: {
      categoryId: number
      filterValues: FilterValues
    }) {
      const newFilters = copy(this.filters)
      if (!deepEqual(newFilters[categoryId], filterValues)) {
        newFilters[categoryId] = filterValues
        this.filters = newFilters

        // Update features visibility
        if (categoryId in this.features) {
          const features: { [categoryId: number]: ApiPoi[] } = copy(
            this.features,
          )
          const filterIsSet = filterValuesIsSet(filterValues)
          features[categoryId] = features[categoryId].map((feature: ApiPoi) => {
            feature.properties.vido_visible
              = !filterIsSet || keepFeature(filterValues, feature)
            return feature
          })
          this.features = features
        }
      }
    },
  },
})
