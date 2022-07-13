import { shallowMount } from '@vue/test-utils'
import { Store } from 'vuex'

import OpeningHours from './OpeningHours.vue'

import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import * as siteStore from '~/store/site'

let store: Store<siteStore.State>

beforeEach(() => {
  store = new Store({
    modules: {
      site: {
        state: {
          locale: 'fr',
        },
        actions: {},
        getters: siteStore.getters,
        namespaced: true,
      },
    },
  })
})

function factory(props = {}) {
  return shallowMount(OpeningHours, {
    store,
    propsData: {
      context: PropertyTranslationsContextEnum.Default,
      tagKey: 'opening_hours',
      openingHours: '24/7',
      baseDate: new Date('2022-01-02 11:00:00'), // Sunday
      ...props,
    },
  })
}

test('opening_hours', () => {
  let wrapper
  wrapper = factory()
  expect(wrapper.find('#_24_7').exists()).toBeTruthy()

  wrapper = factory({ openingHours: 'Su 00:00-24:00' })
  expect(wrapper.find('#opened').exists()).toBeTruthy()

  wrapper = factory({ openingHours: 'Sa 00:00-24:00' })
  expect(wrapper.find('#openAt').exists()).toBeTruthy()

  wrapper = factory({ openingHours: 'k; fjlk-gj; lrjglkregm' })
  expect(wrapper.find('#_24_7').exists()).toBe(false)
  expect(wrapper.find('#opened').exists()).toBe(false)
  expect(wrapper.find('#openAt').exists()).toBe(false)
  expect(wrapper.find('#notOpenedInNextDays').exists()).toBe(false)

  wrapper = factory({ openingHours: '1999-2000 Sa 00:00-24:00' })
  expect(wrapper.find('#notOpenedInNextDays').exists()).toBeTruthy()
})

test('collection_times', () => {
  let wrapper
  wrapper = factory({ tagKey: 'collection_times', openingHours: 'Su 00:00' })
  expect(wrapper.find('#opened').exists()).toBeTruthy()

  wrapper = factory({
    tagKey: 'collection_times',
    openingHours: 'k; fjlk-gj; lrjglkregm',
  })
  expect(wrapper.find('#opened').exists()).toBe(false)
  expect(wrapper.find('#openAt').exists()).toBe(false)
  expect(wrapper.find('#notOpenedInNextDays').exists()).toBe(false)

  wrapper = factory({
    tagKey: 'collection_times',
    openingHours: '1999-2000 Sa 00:00',
  })
  expect(wrapper.find('#notOpenedInNextDays').exists()).toBeTruthy()
})
