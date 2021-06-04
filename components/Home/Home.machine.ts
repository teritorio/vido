import uniq from 'lodash.uniq'
import without from 'lodash.without'
import { assign, Machine } from 'xstate'

import { Category } from '@/utils/types'

export interface HomeContext {
  selectedSubCategoriesIds: Category['id'][]
  selectedRootCategory: {
    id: Category['id']
    subCategories: Category[]
  } | null
  selectedSubCategoryForFilters: Category['id'] | null
}

export enum HomeEvents {
  Init = 'xstate.init',
  GoToHome = 'GO_TO_HOME',
  GoToSearch = 'GO_TO_SEARCH',
  GoToSubCategories = 'GO_TO_SUB_CATEGORIES',
  GoToSubCategoryFilters = 'GO_TO_SUB_CATEGORY_FILTERS',
  SelectSubCategories = 'SELECT_SUB_CATEGORIES',
  ToggleSubCategorySelection = 'TOGGLE_SUB_CATEGORY_SELECTION',
  UnselectSubCategories = 'UNSELECT_SUB_CATEGORIES',
}

export type HomeEvent =
  | { type: HomeEvents.Init }
  | { type: HomeEvents.GoToSearch }
  | { type: HomeEvents.GoToHome }
  | {
      type: HomeEvents.GoToSubCategories
      rootCategoryId: Category['id']
      subCategories: Category[]
    }
  | {
      type: HomeEvents.GoToSubCategoryFilters
      subCategoryId: Category['id']
    }
  | {
      type: HomeEvents.ToggleSubCategorySelection
      subCategoryId: Category['id']
    }
  | {
      type: HomeEvents.SelectSubCategories
      subCategoriesIds: Category['id'][]
    }
  | {
      type: HomeEvents.UnselectSubCategories
      subCategoriesIds: Category['id'][]
    }

export enum HomeStates {
  Home = 'home',
  Idle = 'idle',
  Search = 'search',
  SubCategories = 'subCategories',
  SubCategoryFilters = 'subCategoryFilters',
  Select = 'select',
  Toggle = 'toggle',
  Unselect = 'unselect',
  FetchFeatures = 'fetchFeatures',
}

export interface HomeStateSchema {
  states: {
    [HomeStates.Home]: {}
    [HomeStates.Search]: {}
    [HomeStates.SubCategories]: {
      states: {
        [HomeStates.Idle]: {}
        [HomeStates.FetchFeatures]: {}
      }
    }
    [HomeStates.SubCategoryFilters]: {}
    [HomeStates.FetchFeatures]: {}
  }
}

export const homeMachine = Machine<HomeContext, HomeStateSchema, HomeEvent>(
  {
    id: 'home',
    context: {
      selectedSubCategoriesIds: [],
      selectedRootCategory: null,
      selectedSubCategoryForFilters: null,
    },
    initial: HomeStates.Home,
    on: {
      [HomeEvents.UnselectSubCategories]: {
        actions: ['unselectSubCategories'],
        target: HomeStates.FetchFeatures,
      },
      [HomeEvents.SelectSubCategories]: {
        actions: ['selectSubCategories'],
        target: HomeStates.FetchFeatures,
      },
    },
    states: {
      [HomeStates.Home]: {
        meta: {
          description: 'Main header containing the root categories',
        },
        on: {
          [HomeEvents.GoToSearch]: HomeStates.Search,
          [HomeEvents.GoToSubCategories]: {
            target: HomeStates.SubCategories,
            actions: ['onGoToSubCategories'],
          },
        },
      },
      [HomeStates.Search]: {
        meta: {
          description: 'Secondary header containing the search input',
        },
        on: {
          [HomeEvents.GoToHome]: HomeStates.Home,
        },
      },
      [HomeStates.SubCategories]: {
        meta: {
          description:
            'Secondary header containing the sub-categories of the selected root category',
        },
        exit: ['resetSelectedRootCategoryId'],
        on: {
          [HomeEvents.GoToHome]: HomeStates.Home,
          [HomeEvents.GoToSubCategories]: {
            target: HomeStates.SubCategories,
            actions: ['onGoToSubCategories'],
          },
          [HomeEvents.GoToSubCategoryFilters]: {
            target: HomeStates.SubCategoryFilters,
            actions: ['onGoToSubCategoryFilters'],
          },
        },
        initial: HomeStates.Idle,
        states: {
          [HomeStates.Idle]: {
            on: {
              [HomeEvents.SelectSubCategories]: {
                actions: ['selectSubCategories'],
                target: HomeStates.FetchFeatures,
              },
              [HomeEvents.ToggleSubCategorySelection]: {
                actions: ['toggleSubCategorySelection'],
                target: HomeStates.FetchFeatures,
              },
              [HomeEvents.UnselectSubCategories]: {
                actions: ['unselectSubCategories'],
                target: HomeStates.FetchFeatures,
              },
            },
          },
          [HomeStates.FetchFeatures]: {
            invoke: {
              src: 'fetchFeatures',
              onDone: {
                target: HomeStates.Idle,
              },
            },
          },
        },
      },
      [HomeStates.SubCategoryFilters]: {
        meta: {
          description: 'Secondary header containing subcategory filters',
        },
        on: {
          [HomeEvents.GoToSubCategories]: {
            target: HomeStates.SubCategories,
            actions: ['onGoToSubCategories'],
          },
        },
      },
      [HomeStates.FetchFeatures]: {
        invoke: {
          src: 'fetchFeatures',
          onDone: {
            target: HomeStates.Home,
          },
        },
      },
    },
  },
  {
    actions: {
      onGoToSubCategories: assign<HomeContext, HomeEvent>((context, event) => {
        if (event.type === HomeEvents.GoToSubCategories) {
          return {
            selectedRootCategory: {
              id: event.rootCategoryId,
              subCategories: event.subCategories,
            },
          }
        }

        return context
      }),
      resetSelectedRootCategoryId: assign<HomeContext, HomeEvent>({
        selectedRootCategory: null,
      }),
      selectSubCategories: assign<HomeContext, HomeEvent>((context, event) => {
        if (event.type === HomeEvents.SelectSubCategories) {
          return {
            selectedSubCategoriesIds: uniq([
              ...context.selectedSubCategoriesIds,
              ...event.subCategoriesIds,
            ]),
          }
        }

        return context
      }),
      toggleSubCategorySelection: assign<HomeContext, HomeEvent>(
        (context, event) => {
          if (event.type === HomeEvents.ToggleSubCategorySelection) {
            if (
              context.selectedSubCategoriesIds.includes(event.subCategoryId)
            ) {
              return {
                selectedSubCategoriesIds: without(
                  context.selectedSubCategoriesIds,
                  event.subCategoryId
                ),
              }
            } else {
              return {
                selectedSubCategoriesIds: uniq([
                  ...context.selectedSubCategoriesIds,
                  event.subCategoryId,
                ]),
              }
            }
          }

          return context
        }
      ),
      unselectSubCategories: assign<HomeContext, HomeEvent>(
        (context, event) => {
          if (event.type === HomeEvents.UnselectSubCategories) {
            return {
              selectedSubCategoriesIds: without(
                context.selectedSubCategoriesIds,
                ...event.subCategoriesIds
              ),
            }
          }

          return context
        }
      ),
      onGoToSubCategoryFilters: assign<HomeContext, HomeEvent>(
        (context, event) => {
          if (event.type === HomeEvents.GoToSubCategoryFilters) {
            return {
              selectedSubCategoryForFilters: event.subCategoryId,
            }
          }

          return context
        }
      ),
    },
  }
)
