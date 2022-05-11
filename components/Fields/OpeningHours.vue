<template>
  <div v-if="openingHours">
    <template v-if="nextChange">
      <span v-if="nextChange.type === '24_7'" class="text-emerald-500">
        {{ $tc('openingHours.24_7') }}
      </span>
      <span v-else-if="nextChange.type === 'opened'" class="text-emerald-500">
        {{ $tc('openingHours.opened') }} -
        {{ $tc('openingHours.closeAt') }}
        {{ displayTime(nextChange.nextChange) }}
      </span>
      <span v-else-if="nextChange.type === 'openAt'" class="text-red-500">
        {{ $tc('openingHours.closed') }} -
        {{ $tc('openingHours.openAt') }}
        {{ displayTime(nextChange.nextChange) }}
      </span>
    </template>
    <ul v-if="details">
      <template v-if="schedule.length > 0">
        <li
          v-for="(timeline, i) in schedule"
          :key="`timeline_${i}`"
          class="mt-1"
        >
          {{ timeline }}
        </li>
      </template>
      <li v-else>
        {{ $tc('openingHours.notOpenedInNextDays') }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { format, formatRelative } from 'date-fns'
import { enGB, fr, es } from 'date-fns/locale'
import OpeningHours from 'opening_hours'
import Vue from 'vue'
import { mapGetters } from 'vuex'

const DateFormatLocales: { [key: string]: Locale } = { en: enGB, fr, es }

export default Vue.extend({
  props: {
    openingHours: {
      type: String,
      required: true,
    },
    details: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({
      locale: 'site/locale',
    }),

    formatLocale(): { locale: Locale } {
      return {
        locale: DateFormatLocales?.[this.locale] || enGB,
      }
    },

    nextChange(): null | {
      type: '24_7' | 'opened' | 'openAt'
      nextChange?: Date
    } {
      try {
        const oh = new OpeningHours(this.openingHours)
        const nextChange = oh.getNextChange()

        if (oh.getState()) {
          if (nextChange === undefined) {
            return { type: '24_7' }
          } else {
            return { type: 'opened', nextChange }
          }
        } else {
          return { type: 'openAt', nextChange }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Vido error:', e)
        return null
      }
    },

    schedule(): string[] {
      try {
        const oh = new OpeningHours(this.openingHours, {
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
            state: '',
          },
        })

        const from = new Date()
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
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Vido error:', e)
        return []
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
  },
})
</script>
