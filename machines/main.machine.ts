import uniq from 'lodash.uniq'
import without from 'lodash.without'
import { assign, Machine } from 'xstate'

import { Category } from '@/utils/types'

export interface MainContext {
  selectedSubCategoriesIds: Category['id'][]
  selectedSuperCategory: {
    id: Category['id']
    subCategories: Category[]
  } | null
}

export enum MainEvents {
  GoToSearch = 'GO_TO_SEARCH',
  GoToStart = 'GO_TO_START',
  GoToSubCategories = 'GO_TO_SUB_CATEGORIES',
  SelectSubCategories = 'SELECT_SUB_CATEGORIES',
  ToggleSubCategorySelection = 'TOGGLE_SUB_CATEGORY_SELECTION',
  UnselectSubCategories = 'UNSELECT_SUB_CATEGORIES',
}

export type MainEvent =
  | { type: MainEvents.GoToSearch }
  | { type: MainEvents.GoToStart }
  | {
      type: MainEvents.GoToSubCategories
      subCategories: Category[]
      superCategoryId: Category['id']
    }
  | {
      type: MainEvents.ToggleSubCategorySelection
      subCategoryId: Category['id']
    }
  | {
      type: MainEvents.SelectSubCategories
      subCategoriesIds: Category['id'][]
    }
  | {
      type: MainEvents.UnselectSubCategories
      subCategoriesIds: Category['id'][]
    }

export enum MainStates {
  Search = 'search',
  Start = 'start',
  SubCategories = 'subCategories',
}

export interface MainStateSchema {
  states: {
    [MainStates.Start]: {}
    [MainStates.Search]: {}
    [MainStates.SubCategories]: {}
  }
}

export const mainMachine = Machine<MainContext, MainStateSchema, MainEvent>(
  {
    id: 'main',
    context: {
      selectedSubCategoriesIds: [],
      selectedSuperCategory: null,
    },
    initial: MainStates.Start,
    states: {
      [MainStates.Start]: {
        meta: {
          description: 'Main header containing the super categories',
        },
        on: {
          [MainEvents.GoToSearch]: MainStates.Search,
          [MainEvents.GoToSubCategories]: {
            target: MainStates.SubCategories,
            actions: ['onGoToSubCategories'],
          },
        },
      },
      [MainStates.Search]: {
        meta: {
          description: 'Secondary header containing the search input',
        },
        on: {
          [MainEvents.GoToStart]: MainStates.Start,
        },
      },
      [MainStates.SubCategories]: {
        meta: {
          description:
            'Secondary header containing the sub-categories of the selected super category',
        },
        exit: ['resetSelectedSuperCategoryId'],
        on: {
          [MainEvents.ToggleSubCategorySelection]: {
            actions: ['toggleSubCategorySelection'],
          },
          [MainEvents.SelectSubCategories]: {
            actions: ['selectSubCategories'],
          },
          [MainEvents.UnselectSubCategories]: {
            actions: ['unselectSubCategories'],
          },
          [MainEvents.GoToStart]: MainStates.Start,
        },
      },
    },
  },
  {
    actions: {
      onGoToSubCategories: assign<MainContext, MainEvent>((context, event) => {
        if (event.type === MainEvents.GoToSubCategories) {
          return {
            selectedSuperCategory: {
              id: event.superCategoryId,
              subCategories: event.subCategories,
            },
          }
        }

        return context
      }),
      resetSelectedSuperCategoryId: assign<MainContext, MainEvent>({
        selectedSuperCategory: null,
      }),
      selectSubCategories: assign<MainContext, MainEvent>((context, event) => {
        if (event.type === MainEvents.SelectSubCategories) {
          return {
            selectedSubCategoriesIds: uniq([
              ...context.selectedSubCategoriesIds,
              ...event.subCategoriesIds,
            ]),
          }
        }

        return context
      }),
      toggleSubCategorySelection: assign<MainContext, MainEvent>(
        (context, event) => {
          if (event.type === MainEvents.ToggleSubCategorySelection) {
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
      unselectSubCategories: assign<MainContext, MainEvent>(
        (context, event) => {
          if (event.type === MainEvents.UnselectSubCategories) {
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
    },
  }
)
