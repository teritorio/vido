import {
  Interpreter,
  State,
  Machine,
  ResolveTypegenMeta,
  TypegenDisabled,
  BaseActionObject,
  ServiceMap,
} from 'xstate'

export interface HomeContext {}

export enum HomeEvents {
  Init = 'xstate.init',
  GoToHome = 'GO_TO_HOME',
  GoToCategories = 'GO_TO_CATEGORIES',
  GoToSearch = 'GO_TO_SEARCH',
  GoToSubCategories = 'GO_TO_SUB_CATEGORIES',
  GoToSubCategoryFilters = 'GO_TO_SUB_CATEGORY_FILTERS',
  SelectSubCategories = 'SELECT_SUB_CATEGORIES',
  ToggleSubCategorySelection = 'TOGGLE_SUB_CATEGORY_SELECTION',
  UnselectSubCategories = 'UNSELECT_SUB_CATEGORIES',
}

export type HomeEvent =
  | { type: HomeEvents.Init }
  | { type: HomeEvents.GoToHome }
  | { type: HomeEvents.GoToSearch }
  | { type: HomeEvents.GoToCategories }
  | { type: HomeEvents.GoToSubCategories }
  | { type: HomeEvents.GoToSubCategoryFilters }
  | { type: HomeEvents.ToggleSubCategorySelection }
  | { type: HomeEvents.SelectSubCategories }
  | { type: HomeEvents.UnselectSubCategories }

export enum HomeStates {
  Home = 'home',
  Categories = 'categories',
  Idle = 'idle',
  Search = 'search',
  SubCategories = 'subCategories',
  SubCategoryFilters = 'subCategoryFilters',
}

export interface HomeStateSchema {
  states: {
    [HomeStates.Home]: {}
    [HomeStates.Categories]: {}
    [HomeStates.Search]: {}
    [HomeStates.SubCategories]: {
      states: {
        [HomeStates.Idle]: {}
      }
    }
    [HomeStates.SubCategoryFilters]: {}
  }
}

export const homeMachine = Machine<HomeContext, HomeStateSchema, HomeEvent>({
  id: 'home',
  context: {
    selectedSubCategoriesIds: [],
    selectedRootCategory: null,
    selectedSubCategoryForFilters: null,
  },
  initial: HomeStates.Home,
  on: {
    [HomeEvents.UnselectSubCategories]: {
      target: HomeStates.Home,
    },
    [HomeEvents.SelectSubCategories]: {
      target: HomeStates.Home,
    },
  },
  states: {
    [HomeStates.Home]: {
      meta: {
        description: 'Home',
      },
      on: {
        [HomeEvents.GoToCategories]: HomeStates.Categories,
        [HomeEvents.GoToSearch]: HomeStates.Search,
      },
    },
    [HomeStates.Categories]: {
      meta: {
        description: 'Main header containing the root categories',
      },
      on: {
        [HomeEvents.GoToHome]: HomeStates.Home,
        [HomeEvents.GoToSearch]: HomeStates.Search,
        [HomeEvents.GoToSubCategories]: {
          target: HomeStates.SubCategories,
        },
      },
    },
    [HomeStates.Search]: {
      meta: {
        description: 'Secondary header containing the search input',
      },
      on: {
        [HomeEvents.GoToHome]: HomeStates.Home,
        [HomeEvents.GoToCategories]: HomeStates.Categories,
      },
    },
    [HomeStates.SubCategories]: {
      meta: {
        description:
          'Secondary header containing the sub-categories of the selected root category',
      },
      on: {
        [HomeEvents.GoToHome]: HomeStates.Home,
        [HomeEvents.GoToCategories]: HomeStates.Categories,
        [HomeEvents.GoToSubCategories]: {
          target: HomeStates.SubCategories,
        },
        [HomeEvents.GoToSubCategoryFilters]: {
          target: HomeStates.SubCategoryFilters,
        },
      },
      initial: HomeStates.Idle,
      states: {
        [HomeStates.Idle]: {
          on: {
            [HomeEvents.SelectSubCategories]: {
              target: HomeStates.Idle,
            },
            [HomeEvents.ToggleSubCategorySelection]: {
              target: HomeStates.Idle,
            },
            [HomeEvents.UnselectSubCategories]: {
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
        [HomeEvents.GoToHome]: HomeStates.Home,
        [HomeEvents.GoToSubCategories]: {
          target: HomeStates.SubCategories,
        },
      },
    },
  },
})

export type HomeTypestate = any
export type HomeResolvedTypesMeta = ResolveTypegenMeta<
  TypegenDisabled,
  HomeEvent,
  BaseActionObject,
  ServiceMap
>

export type HomeState = State<
  HomeContext,
  HomeEvent,
  HomeStateSchema,
  HomeTypestate,
  HomeResolvedTypesMeta
>

export type HomeInterpreter = Interpreter<
  HomeContext,
  HomeStateSchema,
  HomeEvent,
  HomeTypestate,
  HomeResolvedTypesMeta
>
