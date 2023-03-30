import { createPinia } from 'pinia'
import { createApp } from 'vue'

import OpeningHours from '~/components/Fields/OpeningHours.vue'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import { siteStore } from '~/stores/site'

const realPinia = createPinia()

beforeEach(() => {
  siteStore(realPinia).$patch({
    locale: 'fr',
  })
})

function factory(props = {}) {
  const el = document.createElement('div')
  createApp(OpeningHours, {
    context: PropertyTranslationsContextEnum.Default,
    tagKey: 'opening_hours',
    openingHours: '24/7',
    baseDate: new Date('2022-01-02 11:00:00'), // Sunday
    ...props,
  }).mount(el)
  return el
}

test('opening_hours', () => {
  let wrapper
  wrapper = factory({ openingHours: 'Su 00:00-24:00' })
  expect(wrapper.querySelector('#opened')).toBeTruthy()

  wrapper = factory({ openingHours: 'Sa 00:00-24:00' })
  expect(wrapper.querySelector('#openAt')).toBeTruthy()

  wrapper = factory({ openingHours: 'k; fjlk-gj; lrjglkregm' })
  expect(wrapper.querySelector('#_24_7')).toBeFalsy()
  expect(wrapper.querySelector('#opened')).toBeFalsy()
  expect(wrapper.querySelector('#openAt')).toBeFalsy()
})

test('collection_times', () => {
  let wrapper
  wrapper = factory({ tagKey: 'collection_times', openingHours: 'Su 00:00' })
  expect(wrapper.querySelector('#next')).toBeTruthy()

  wrapper = factory({
    tagKey: 'collection_times',
    openingHours: 'k; fjlk-gj; lrjglkregm',
  })
  expect(wrapper.querySelector('#next')).toBeFalsy()
})

test('pretty', () => {
  let wrapper
  wrapper = factory({
    openingHours: 'Tu-Sa 07:00-12:30,13:30-19:00; Su 07:30-12:15',
  })
  expect(wrapper.querySelector('ul > li:nth-child(1)')?.innerHTML).toEqual(
    '<li>Mar.-sam. 07:00-12:30,13:30-19:00</li>'
  )
  expect(wrapper.querySelector('ul > li:nth-child(2)')?.innerHTML).toEqual(
    '<li>Dim. 07:30-12:15</li>'
  )

  wrapper = factory({ openingHours: 'Apr-Oct: Fr-Su 10:00-18:00' })
  expect(wrapper.querySelector('ul > li:nth-child(1)')?.innerHTML).toEqual(`<li>
  Avr.-oct.
  <ul>
    <li>Ven.-dim. 10:00-18:00</li>
  </ul>
</li>`)

  wrapper = factory({
    openingHours: 'Tu-Sa 07:00-12:30,13:30-19:00; Su,PH 07:30-12:15',
  })
  expect(wrapper.querySelector('ul > li:nth-child(1)')?.innerHTML).toEqual(
    '<li>Mar.-sam. 07:00-12:30,13:30-19:00</li>'
  )
  expect(wrapper.querySelector('ul > li:nth-child(2)')?.innerHTML).toEqual(
    '<li>Dim.,PH 07:30-12:15</li>'
  )
})
