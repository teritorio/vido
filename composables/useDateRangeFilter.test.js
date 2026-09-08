import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect, it } from 'mocha'
import { useSiteStore } from '~/stores/site'
import { useDateRangeFilter } from '~/composables/useDateRangeFilter'

const SETTINGS = {
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
}

function makeFilter(begin, end) {
  return {
    type: 'date_range',
    filterValueBegin: begin,
    filterValueEnd: end,
    def: { type: 'date_range', property: ['date_range'] },
  }
}

function makeProps({ openingHours, startDate, endDate } = {}) {
  return {
    metadata: { id: 1 },
    opening_hours: openingHours,
    date_range: { start_date: startDate, end_date: endDate },
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  useSiteStore().$patch({ settings: SETTINGS })
})

it('isDateRangeMatch — opening_hours occurrence within filter range', () => {
  const { isDateRangeMatch } = useDateRangeFilter()
  expect(isDateRangeMatch(
    makeFilter('2024-09-01', '2024-09-10'),
    makeProps({ openingHours: 'Sep 05 00:00-24:00' }),
  )).toBeTruthy()
})

it('isDateRangeMatch — opening_hours occurrence outside filter range', () => {
  const { isDateRangeMatch } = useDateRangeFilter()
  expect(isDateRangeMatch(
    makeFilter('2024-09-10', '2024-09-20'),
    makeProps({ openingHours: 'Sep 05 00:00-24:00' }),
  )).toBeFalsy()
})

it('isDateRangeMatch — multiple occurrences, one within range', () => {
  const { isDateRangeMatch } = useDateRangeFilter()
  expect(isDateRangeMatch(
    makeFilter('2024-10-15', '2024-10-19'),
    makeProps({ openingHours: 'Sep 05 00:00-24:00;Oct 17 00:00-24:00;Nov 21 00:00-24:00' }),
  )).toBeTruthy()
})

it('isDateRangeMatch — multiple occurrences, none within range', () => {
  const { isDateRangeMatch } = useDateRangeFilter()
  expect(isDateRangeMatch(
    makeFilter('2024-12-01', '2024-12-31'),
    makeProps({ openingHours: 'Sep 05 00:00-24:00;Oct 17 00:00-24:00;Nov 21 00:00-24:00' }),
  )).toBeFalsy()
})

it('isDateRangeMatch — fallback: start_date/end_date overlap', () => {
  const { isDateRangeMatch } = useDateRangeFilter()
  // Event spans Sep 01–Sep 30, filter Sep 15–Sep 20 → overlap
  expect(isDateRangeMatch(
    makeFilter('2024-09-15', '2024-09-20'),
    makeProps({ startDate: '2024-09-01', endDate: '2024-09-30' }),
  )).toBeTruthy()
  // Event spans Oct 01–Oct 31, filter Sep 15–Sep 20 → no overlap
  expect(isDateRangeMatch(
    makeFilter('2024-09-15', '2024-09-20'),
    makeProps({ startDate: '2024-10-01', endDate: '2024-10-31' }),
  )).toBeFalsy()
})
