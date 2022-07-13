<template>
  <div v-if="openingHours">
    <span hidden>{{ openingHours }}</span>
    <template v-if="nextChange">
      <span
        v-if="nextChange.type === '24_7'"
        id="_24_7"
        class="text-emerald-500"
      >
        {{ $tc('openingHours.24_7') }}
      </span>
      <span
        v-else-if="nextChange.type === 'opened'"
        id="opened"
        class="text-emerald-500"
      >
        {{ $tc('openingHours.opened') }}
        <template v-if="nextChange.nextChange">
          -
          {{ $tc('openingHours.closeAt') }}
          {{ displayTime(nextChange.nextChange) }}
        </template>
      </span>
      <span
        v-else-if="nextChange.type === 'openAt'"
        id="openAt"
        class="text-red-500"
      >
        {{ $tc('openingHours.closed') }}

        <template v-if="nextChange.nextChange">
          -
          {{ $tc('openingHours.openAt') }}
          {{ displayTime(nextChange.nextChange) }}
        </template>
      </span>
    </template>
    <ul v-if="!isCompact">
      <li
        v-if="typeof schedule !== 'undefined' && schedule.length === 0"
        id="notOpenedInNextDays"
      >
        {{ $tc('openingHours.notOpenedInNextDays') }}
      </li>
      <template v-else-if="nextChange && nextChange.type !== '24_7'">
        <li
          v-for="(timeline, i) in schedule"
          :key="`timeline_${i}`"
          class="mt-1"
        >
          {{ timeline }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import { format, formatRelative } from 'date-fns'
import { enGB, fr, es } from 'date-fns/locale'
import OpeningHours, { optional_conf } from 'opening_hours'
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

const DateFormatLocales: { [key: string]: Locale } = { en: enGB, fr, es }

// List of tag keys regex copied from opening_hours.js
const SupportedOsmKeys = [
  /opening_hours/,
  /collection_times/,
  /opening_hours:.+/,
  /.+:opening_hours/,
  /.+:opening_hours:.+/,
  /smoking_hours/,
  /service_times/,
  /happy_hours/,
  /lit/,
]

export function isOpeningHoursSupportedOsmTags(key: string): boolean {
  return SupportedOsmKeys.some((regexKey) => regexKey.test(key))
}

export default Vue.extend({
  props: {
    context: {
      type: String as PropType<PropertyTranslationsContextEnum>,
      required: true,
    },
    tagKey: {
      type: String,
      required: true,
    },
    openingHours: {
      type: String,
      required: true,
    },
    baseDate: {
      type: Date as PropType<Date>,
      default: () => new Date(),
    },
  },

  computed: {
    ...mapGetters({
      locale: 'site/locale',
    }),

    fromMidnightBaseDate(): Date {
      const d = new Date(this.baseDate)
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      return d
    },

    isCompact(): boolean {
      return this.context === PropertyTranslationsContextEnum.Popup
    },

    formatLocale(): { locale: Locale } {
      return {
        locale: DateFormatLocales?.[this.locale] || enGB,
      }
    },

    nextChange():
      | undefined
      | {
          type: '24_7' | 'opened' | 'openAt'
          nextChange?: Date
        } {
      const oh = this.OpeningHoursFactory()
      if (oh) {
        const nextChange = oh.getNextChange(this.fromMidnightBaseDate)

        if (oh.getState(this.fromMidnightBaseDate)) {
          if (nextChange === undefined) {
            return { type: '24_7' }
          } else {
            return { type: 'opened', nextChange }
          }
        } else {
          return { type: 'openAt', nextChange }
        }
      } else {
        return undefined
      }
    },

    schedule(): string[] | undefined {
      const oh = this.OpeningHoursFactory()
      if (oh) {
        const nextChange = oh.getNextChange(this.fromMidnightBaseDate)
        if (!nextChange && oh.getState(this.fromMidnightBaseDate)) {
          return undefined
        }

        const from = this.fromMidnightBaseDate
        from.setDate(from.getDate() + ((7 - from.getDay()) % 7 || 7))

        const to = new Date(from)
        to.setDate(to.getDate() + 14)

        const intervals = oh.getOpenIntervals(from, to)
        const sortedIntervals: string[] = []

        intervals.forEach((interval, i) => {
          if (
            i > 0 &&
            interval[0].getDate() === intervals[i - 1][0].getDate()
          ) {
            sortedIntervals[sortedIntervals.length - 1] +=
              ' / ' +
              format(interval[0], 'HH:mm', this.formatLocale) +
              ' - ' +
              format(interval[1], 'HH:mm', this.formatLocale)
          } else {
            sortedIntervals.push(
              format(
                interval[0],
                this.$tc('openingHours.formatDayAndDayInMonth'),
                this.formatLocale
              ) +
                ' ' +
                format(interval[0], 'HH:mm', this.formatLocale) +
                '-' +
                format(interval[1], 'HH:mm', this.formatLocale)
            )
          }
        })

        return sortedIntervals
      } else {
        return undefined
      }
    },
  },

  methods: {
    displayTime(dateGMT: Date): null | string {
      if (dateGMT) {
        const date = new Date(dateGMT)
        const today = new Date()

        return formatRelative(date, today, this.formatLocale)
      }
      return null
    },

    OpeningHoursFactory(): OpeningHours | undefined {
      try {
        // https://github.com/opening-hours/opening_hours.js/issues/428
        // @ts-ignore
        const optionalConf: optional_conf = {
          tag_key: this.tagKey,
        }
        return new OpeningHours(
          this.openingHours,
          {
            lon:
              (this.$settings.bbox_line.coordinates[0][1] +
                this.$settings.bbox_line.coordinates[1][1]) /
              2,
            lat:
              (this.$settings.bbox_line.coordinates[0][0] +
                this.$settings.bbox_line.coordinates[1][0]) /
              2,
            address: {
              country_code: this.$settings.default_country,
              state: this.$settings.default_country_state_opening_hours,
            },
          },
          optionalConf
        )
      } catch (e) {
        console.log('Vido error:', e)
      }
    },
  },
})
</script>
