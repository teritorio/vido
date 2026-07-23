<script setup lang="ts">
import type { optional_conf } from 'opening_hours'
import OpeningHours from 'opening_hours'
import RelativeDate from '~/components/UI/RelativeDate.vue'
import { PropertyTranslationsContextEnum, useSiteStore } from '~/stores/site'
import type { AssocRenderKey, AssocRenderValue } from '~/utils/types'
import { assocRenderKey } from '~/utils/types'

//
// Props
//
const props = withDefaults(defineProps<{
  baseDate?: Date
  context: PropertyTranslationsContextEnum
  openingHours: string
  renderKey: AssocRenderKey
}>(), {
  baseDate: () => new Date(),
})

//
// Composables
//
const siteStore = useSiteStore()
const { settings } = siteStore
const { locale, t, d } = useI18n()

const PointTime = ['collection_times'] as AssocRenderValue[]

const tagKey = computed(() => assocRenderKey[props.renderKey])

//
// Computed
//
const isPointTime = computed(() => PointTime.includes(tagKey.value))

const oh = computed(() => OpeningHoursFactory())

const comment = computed(() => oh.value?.getComment(props.baseDate))

const isCompact = computed(() => props.context === PropertyTranslationsContextEnum.Card)

const isEvent = computed(() =>
  /^(?:\d{4}\s|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2}(?:\s|$))/i.test(props.openingHours),
)

const variable = computed(() => {
  try {
    return !oh.value?.isWeekStable()
  }
  catch (e) {
    if (import.meta.dev)
      console.warn('[OpeningHours] isWeekStable failed:', props.openingHours, e)
    return false
  }
})

const pretty = computed((): [string | undefined, string[]][] | undefined => {
  if (oh.value) {
    let prettyString
    try {
      prettyString = oh.value
        .prettifyValue({
          conf: {
            locale: locale.value || 'en',
            rule_sep_string: '\n',
            print_semicolon: false,
          },
        })
        .replace(/(^\w|\s\w)/g, (c: string) => c.toUpperCase())
        .split('\n')
    }
    catch (e) {
      if (import.meta.dev)
        console.warn('[OpeningHours] prettifyValue failed:', props.openingHours, e)
      return undefined
    }
    if (!variable.value) {
      return [[undefined, prettyString]]
    }
    else {
      const ret: [string | undefined, string[]][] = []
      // Stable group by month
      prettyString
        .map((row: string) => (
          row.includes(': ')
            ? [row.slice(0, row.indexOf(': ')), row.slice(row.indexOf(': ') + 2)]
            : [undefined, row]
        ) as [string | undefined, string])
        .forEach(([month, date]) => {
          const i = ret.findIndex(r => r[0] === month)
          if (i >= 0)
            ret[i][1].push(date)
          else
            ret.push([month, [date]])
        })
      return ret
    }
  }
  return undefined
})

const eventDisplay = computed((): { date: Date, end: Date | undefined, unknown: boolean } | undefined => {
  if (!isEvent.value || !oh.value)
    return undefined
  try {
    const year = props.baseDate.getFullYear()
    const intervals = oh.value.getOpenIntervals(
      new Date(year - 1, 0, 1),
      new Date(year + 2, 0, 1),
    )
    if (intervals.length > 0) {
      const [start, end, unknown] = intervals[0]
      return { date: start, end: end ?? undefined, unknown }
    }
  }
  catch (e) {
    if (import.meta.dev)
      console.warn('[OpeningHours] getOpenIntervals failed:', props.openingHours, e)
  }
  return undefined
})

const nextChange = computed((): { type: 'opened' | 'openAt' | 'unknown', nextChange: Date } | undefined => {
  if (oh.value) {
    try {
      const nextChange = oh.value.getNextChange(props.baseDate)
      if (nextChange) {
        const isUnknown = oh.value.getUnknown(props.baseDate)
        return {
          type: isUnknown ? 'unknown' : (oh.value.getState(props.baseDate) ? 'opened' : 'openAt'),
          nextChange,
        }
      }
    }
    catch (e) {
      if (import.meta.dev)
        console.warn('[OpeningHours] getNextChange failed:', props.openingHours, e)
      return undefined
    }
  }
  return undefined
})

//
// Methods
//
function OpeningHoursFactory(): OpeningHours | undefined {
  if (!settings?.bbox_line || !settings.default_country || !settings.default_country_state_opening_hours)
    return undefined

  try {
    // https://github.com/opening-hours/opening_hours.js/issues/428
    const optionalConf = {
      tag_key: tagKey.value,
      mode: undefined,
      map_value: undefined,
      warnings_severity: undefined,
      locale: locale.value,
    } satisfies optional_conf
    return new OpeningHours(
      props.openingHours,
      {
        lon:
          (settings.bbox_line.coordinates[0][0]
          + settings.bbox_line.coordinates[1][0])
          / 2,
        lat:
          (settings.bbox_line.coordinates[0][1]
          + settings.bbox_line.coordinates[1][1])
          / 2,
        address: {
          country_code: settings.default_country,
          state: settings.default_country_state_opening_hours,
        },
      },
      optionalConf,
    )
  }
  catch (e) {
    if (import.meta.dev)
      console.warn('[OpeningHours] failed to parse:', props.openingHours, e)
  }
}
</script>

<template>
  <div v-if="openingHours">
    <span hidden>{{ openingHours }}</span>
    <ClientOnly>
      <template v-if="nextChange && !isEvent">
        <p v-if="isPointTime" id="next" class="tw-text-emerald-500">
          {{ t('openingHours.next') }}
          <RelativeDate :date="nextChange.nextChange" />
        </p>
        <template v-else>
          <p
            v-if="nextChange.type === 'opened'"
            id="opened"
            class="tw-text-emerald-500"
          >
            {{ t('openingHours.opened') }}
            <template v-if="nextChange.nextChange">
              -
              {{ t('openingHours.closeAt') }}
              <RelativeDate :date="nextChange.nextChange" />
            </template>
          </p>
          <p
            v-else-if="nextChange.type === 'openAt'"
            id="openAt"
            class="tw-text-red-500"
          >
            {{ t('openingHours.closed') }}
            <template v-if="nextChange.nextChange">
              -
              {{ t('openingHours.openAt') }}
              <RelativeDate :date="nextChange.nextChange" />
            </template>
          </p>
          <p
            v-else-if="nextChange.type === 'unknown'"
            id="unknown"
            class="tw-text-amber-500"
          >
            {{ t('openingHours.unknown') }}
          </p>
        </template>
        <br v-if="!isCompact">
      </template>
    </ClientOnly>
    <template v-if="!isCompact">
      <div v-if="pretty && !pretty[0][0] && pretty[0][1].length === 1">
        {{ pretty[0][1][0] }}
      </div>
      <ul v-else-if="pretty && !pretty[0][0]">
        <li v-for="(row, i) in pretty[0][1]" :key="i">
          {{ row }}
        </li>
      </ul>
      <ul v-else-if="pretty">
        <li v-for="[month, dates] in pretty" :key="month">
          {{ month }}
          <ul>
            <li v-for="(row, i) in dates" :key="i">
              {{ row }}
            </li>
          </ul>
        </li>
      </ul>
      <template v-if="variable && !isEvent">
        <p>{{ t('openingHours.variableWeek') }}</p>
      </template>
    </template>
    <template v-if="isCompact">
      <ClientOnly>
        <p v-if="isEvent && eventDisplay && !eventDisplay.unknown">
          {{ t('openingHours.eventRange', {
            date: d(eventDisplay.date, { dateStyle: 'short' }),
            start: d(eventDisplay.date, { timeStyle: 'short' }),
            end: d(eventDisplay.end!, { timeStyle: 'short' }),
          }) }}
        </p>
        <p v-else-if="isEvent && eventDisplay && eventDisplay.unknown">
          {{ t('openingHours.eventRangeOpenEnd', {
            date: d(eventDisplay.date, { dateStyle: 'short' }),
            start: d(eventDisplay.date, { timeStyle: 'short' }),
          }) }}
        </p>
        <p v-else-if="comment">
          {{ comment }}
        </p>
        <template #fallback>
          <p v-if="isEvent && pretty">
            {{ pretty[0][1][0] }}
          </p>
        </template>
      </ClientOnly>
    </template>
  </div>
</template>
