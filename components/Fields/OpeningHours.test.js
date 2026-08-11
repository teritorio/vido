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

it('osm:opening_hours@event — hides status, shows pretty in all contexts', () => {
  let wrapper
  wrapper = factory({ renderKey: 'osm:opening_hours@event', openingHours: 'Su 00:00-24:00' })
  expect(wrapper.querySelector('#opened')).toBeFalsy()
  expect(wrapper.querySelector('#openAt')).toBeFalsy()
  expect(wrapper.querySelector('ul > li')).toBeTruthy()

  wrapper = factory({
    renderKey: 'osm:opening_hours@event',
    openingHours: 'Su 00:00-24:00',
    context: PropertyTranslationsContextEnum.Card,
  })
  expect(wrapper.querySelector('#opened')).toBeFalsy()
  expect(wrapper.querySelector('ul > li')).toBeTruthy()
})

it('osm:opening_hours@event — hides variableWeek paragraph', () => {
  // Baseline: variableWeek paragraph visible for osm:opening_hours
  let wrapper = factory({ openingHours: 'Mo[1,3] 09:00-17:00' })
  expect(wrapper.querySelector('p')).toBeTruthy()

  // Event render: variableWeek paragraph suppressed
  wrapper = factory({ renderKey: 'osm:opening_hours@event', openingHours: 'Mo[1,3] 09:00-17:00' })
  expect(wrapper.querySelector('p')).toBeFalsy()
})

it('osm:opening_hours@event — hides comment in Card context', () => {
  // Baseline: comment paragraph visible for osm:opening_hours in Card context
  let wrapper = factory({
    openingHours: 'Mo-Fr 09:00-17:00 "by appointment"',
    context: PropertyTranslationsContextEnum.Card,
  })
  expect(wrapper.querySelector('p')).toBeTruthy()

  // Event render: comment paragraph suppressed in Card context
  wrapper = factory({
    renderKey: 'osm:opening_hours@event',
    openingHours: 'Mo-Fr 09:00-17:00 "by appointment"',
    context: PropertyTranslationsContextEnum.Card,
  })
  expect(wrapper.querySelector('p')).toBeFalsy()
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
