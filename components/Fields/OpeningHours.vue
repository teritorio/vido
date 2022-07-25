<template>
  <div v-if="openingHours">
    <span hidden>{{ openingHours }}</span>
    <template v-if="nextChange">
      <p v-if="isPointTime" id="next" class="text-emerald-500">
        {{ $tc('openingHours.next') }}
        {{ displayTime(nextChange.nextChange) }}
      </p>
      <template v-else>
        <p
          v-if="nextChange.type === 'opened'"
          id="opened"
          class="text-emerald-500"
        >
          {{ $tc('openingHours.opened') }}
          <template v-if="nextChange.nextChange">
            -
            {{ $tc('openingHours.closeAt') }}
            {{ displayTime(nextChange.nextChange) }}
          </template>
        </p>
        <p
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
        </p>
      </template>
    </template>
    <template v-if="!isCompact">
      <template v-if="pretty">
        <ul>
          <li v-for="(row, i) in pretty" :key="i">{{ row }}</li>
        </ul>
      </template>
      <template v-if="variable">
        <p>{{ $tc('openingHours.variableWeek') }}</p>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { formatRelative } from 'date-fns'
import { enGB, fr, es } from 'date-fns/locale'
import OpeningHours, { optional_conf } from 'opening_hours'
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

const DateFormatLocales: { [key: string]: Locale } = { en: enGB, fr, es }

const PointTime = [/collection_times/, /service_times/]

// List of tag keys regex copied from opening_hours.js
const SupportedOsmKeys = [
  ...PointTime,
  /opening_hours/,
  /opening_hours:.+/,
  /.+:opening_hours/,
  /.+:opening_hours:.+/,
  /smoking_hours/,
  /happy_hours/,
  /lit/,
]

function isSupportedOsmTags(keys: RegExp[], key: string): boolean {
  return keys.some((regexKey) => regexKey.test(key))
}

export function isOpeningHoursSupportedOsmTags(key: string): boolean {
  return isSupportedOsmTags(SupportedOsmKeys, key)
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

    isPointTime(): boolean {
      return isSupportedOsmTags(PointTime, this.tagKey)
    },

    isCompact(): boolean {
      return this.context === PropertyTranslationsContextEnum.Popup
    },

    formatLocale(): { locale: Locale } {
      return {
        locale: DateFormatLocales?.[this.locale] || enGB,
      }
    },

    pretty(): string[] | undefined {
      const oh = this.OpeningHoursFactory()
      if (oh) {
        return oh
          .prettifyValue({
            // @ts-ignore
            conf: {
              locale: this.locale || 'en',
              rule_sep_string: '\n',
              print_semicolon: false,
            },
          })
          .replace(/(^\w|\s\w)/g, (c) => c.toUpperCase())
          .split('\n')
      } else {
        return undefined
      }
    },

    variable(): boolean {
      const oh = this.OpeningHoursFactory()
      return !Boolean(oh?.isWeekStable())
    },

    nextChange():
      | undefined
      | {
          type: 'opened' | 'openAt'
          nextChange: Date
        } {
      const oh = this.OpeningHoursFactory()
      if (oh) {
        const nextChange = oh.getNextChange(this.baseDate)
        if (nextChange) {
          return {
            type: oh.getState(this.baseDate) ? 'opened' : 'openAt',
            nextChange,
          }
        }
      }
      return undefined
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
