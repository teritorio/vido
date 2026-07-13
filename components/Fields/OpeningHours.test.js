import { createPinia } from 'pinia'
import { createApp, defineComponent } from 'vue'
import { beforeEach, expect, it } from 'mocha'
import OpeningHours from '~/components/Fields/OpeningHours.vue'
import { PropertyTranslationsContextEnum, useSiteStore } from '~/stores/site'

const realPinia = createPinia()

beforeEach(() => {
  useSiteStore(realPinia).$patch({
    settings: {
      slug: 'test',
      attributions: [],
      icon_font_css_url: '',
      themes: {},
      bbox_line: {
        type: 'LineString',
        coordinates: [
          [1.43862, 42.41845],
          [1.68279, 42.6775],
        ],
      },
      default_country: 'fr',
      default_country_state_opening_hours: 'FR-OC',
    },
  })
})

const ClientOnlyStub = defineComponent({
  setup(_, { slots }) {
    return () => slots.default?.()
  },
})

function factory(props = {}) {
  const el = document.createElement('div')
  createApp(OpeningHours, {
    context: PropertyTranslationsContextEnum.Default,
    renderKey: 'osm:opening_hours',
    openingHours: '24/7',
    baseDate: new Date('2022-01-02 11:00:00'), // Sunday
    ...props,
  }).component('ClientOnly', ClientOnlyStub).use(realPinia).mount(el)
  return el
}

it('opening_hours', () => {
  let wrapper
  wrapper = factory({ openingHours: 'Su 00:00-24:00' })
  expect(wrapper.querySelector('#opened')).toBeTruthy()

  wrapper = factory({ openingHours: 'Sa 00:00-24:00' })
  expect(wrapper.querySelector('#openAt')).toBeTruthy()

  wrapper = factory({ openingHours: 'k; fjlk-gj; lrjglkregm' })
  expect(wrapper.querySelector('#opened')).toBeFalsy()
  expect(wrapper.querySelector('#openAt')).toBeFalsy()
})

it('collection_times', () => {
  let wrapper
  wrapper = factory({ renderKey: 'osm:collection_times', openingHours: 'Su 00:00' })
  expect(wrapper.querySelector('#next')).toBeTruthy()

  wrapper = factory({
    renderKey: 'osm:collection_times',
    openingHours: 'k; fjlk-gj; lrjglkregm',
  })
  expect(wrapper.querySelector('#next')).toBeFalsy()
})

it('pretty', () => {
  let wrapper
  wrapper = factory({
    openingHours: 'Tu-Sa 07:00-12:30,13:30-19:00; Su 07:30-12:15',
  })
  expect(wrapper.querySelector('ul > li:nth-child(1)')?.innerHTML).toEqual(
    '<li>Mar.-sam. 07:00-12:30,13:30-19:00</li>',
  )
  expect(wrapper.querySelector('ul > li:nth-child(2)')?.innerHTML).toEqual(
    '<li>Dim. 07:30-12:15</li>',
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
    '<li>Mar.-sam. 07:00-12:30,13:30-19:00</li>',
  )
  expect(wrapper.querySelector('ul > li:nth-child(2)')?.innerHTML).toEqual(
    '<li>Dim.,PH 07:30-12:15</li>',
  )
})

it('isEvent — suppresses variableWeek warning (year-prefixed)', () => {
  const wrapper = factory({ openingHours: '2025 Jan 25 20:30-22:00' })
  const paragraphs = [...wrapper.querySelectorAll('p')]
  const hasVariableWeek = paragraphs.some(p =>
    p.textContent?.includes('variabl'),
  )
  expect(hasVariableWeek).toBeFalsy()
})

it('isEvent — suppresses variableWeek warning (month-prefixed, no year)', () => {
  const wrapper = factory({ openingHours: 'Aug 04 18:00-23:00' })
  const paragraphs = [...wrapper.querySelectorAll('p')]
  const hasVariableWeek = paragraphs.some(p =>
    p.textContent?.includes('variabl'),
  )
  expect(hasVariableWeek).toBeFalsy()
})

it('isEvent — non-event still shows variableWeek for variable schedules', () => {
  const wrapper = factory({ openingHours: 'Apr-Oct: Fr-Su 10:00-18:00' })
  const paragraphs = [...wrapper.querySelectorAll('p')]
  const hasVariableWeek = paragraphs.some(p =>
    p.textContent?.includes('variabl'),
  )
  expect(hasVariableWeek).toBeTruthy()
})

it('isEvent — seasonal date range is not an event', () => {
  // "Apr 1-Oct 31: ..." starts with "Apr " but is a seasonal schedule, not a one-time event
  const wrapper = factory({ openingHours: 'Apr 1-Oct 31: Fr-Su 10:00-18:00' })
  const paragraphs = [...wrapper.querySelectorAll('p')]
  const hasVariableWeek = paragraphs.some(p =>
    p.textContent?.includes('variabl'),
  )
  expect(hasVariableWeek).toBeTruthy()
})
