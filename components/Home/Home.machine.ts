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
}

export type HomeEvent =
  | { type: HomeEvents.Init }
  | { type: HomeEvents.GoToHome }
  | { type: HomeEvents.GoToSearch }
  | { type: HomeEvents.GoToCategories }

export enum HomeStates {
  Home = 'home',
  Categories = 'categories',
  Search = 'search',
}

export interface HomeStateSchema {
  states: {
    [HomeStates.Home]: {}
    [HomeStates.Categories]: {}
    [HomeStates.Search]: {}
  }
}

export const homeMachine = Machine<HomeContext, HomeStateSchema, HomeEvent>({
  id: 'home',
  initial: HomeStates.Home,
  on: {},
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
