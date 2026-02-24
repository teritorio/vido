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
const { locale } = useI18n()
const { t } = useI18n()

const PointTime = ['collection_times'] as AssocRenderValue[]

const tagKey = computed(() => assocRenderKey[props.renderKey])

//
// Computed
//
const isPointTime = computed(() => PointTime.includes(tagKey.value))

const comment = computed(() => {
  const oh = OpeningHoursFactory()
  return oh?.getComment(props.baseDate)
})

const isCompact = computed(() => props.context === PropertyTranslationsContextEnum.Card)

const variable = computed(() => {
  const oh = OpeningHoursFactory()
  try {
    return !oh?.isWeekStable()
  }
  catch (e) {
    return false
  }
})

const pretty = computed((): [string | undefined, string[]][] | undefined => {
  const oh = OpeningHoursFactory()
  if (oh) {
    let prettyString
    try {
      prettyString = oh
        .prettifyValue({
          // @ts-expect-error: Fix typings
          conf: {
            locale: locale.value || 'en',
            rule_sep_string: '\n',
            print_semicolon: false,
          },
        })
        .replace(/(^\w|\s\w)/g, (c: any) => c.toUpperCase())
        .split('\n')
    }
    catch (e) {
      return undefined
    }
    if (!variable.value) {
      return [[undefined, prettyString]]
    }
    else {
      const ret: [string | undefined, string[]][] = []
      // Stable group by month
      prettyString
        .map((row: any) => (
          row.includes(': ')
            ? [row.slice(0, row.indexOf(': ')), row.slice(row.indexOf(': ') + 1 + 1)]
            : [undefined, row]
        ) as [string | undefined, string])
        .forEach(([month, date]: any) => {
          const i = ret.findIndex(r => r[0] === month)
          if (i >= 0)
            ret[i][1].push(date)
          else
            ret.push([month, [date]])
        })
      return ret
    }
  }
  else {
    return undefined
  }
})

const nextChange = computed((): { type: 'opened' | 'openAt', nextChange: Date } | undefined => {
  const oh = OpeningHoursFactory()
  if (oh) {
    try {
      const nextChange = oh.getNextChange(props.baseDate)
      if (nextChange) {
        return {
          type: oh.getState(props.baseDate) ? 'opened' : 'openAt',
          nextChange,
        }
      }
    }
    catch (e) {
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
    // @ts-expect-error: Fix typings
    const optionalConf: optional_conf = {
      tag_key: tagKey.value,
    }
    return new OpeningHours(
      props.openingHours,
      {
        lon:
          (settings.bbox_line.coordinates[0][1]
          + settings.bbox_line.coordinates[1][1])
          / 2,
        lat:
          (settings.bbox_line.coordinates[0][0]
          + settings.bbox_line.coordinates[1][0])
          / 2,
        address: {
          country_code: settings.default_country,
          state: settings.default_country_state_opening_hours,
        },
      },
      optionalConf,
    )
  }
  catch (e) {}
}
</script>

<template>
  <div v-if="openingHours">
    <span hidden>{{ openingHours }}</span>
    <template v-if="nextChange">
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
      </template>
    </template>
    <template v-if="!isCompact">
      <br>
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
      <template v-if="variable">
        <p>{{ t('openingHours.variableWeek') }}</p>
      </template>
    </template>
    <template v-if="isCompact && comment">
      <p>{{ comment }}</p>
    </template>
  </div>
</template>
