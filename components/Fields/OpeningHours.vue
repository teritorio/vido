<script lang="ts">
import type { optional_conf } from 'opening_hours'
import OpeningHours from 'opening_hours'
import { mapState } from 'pinia'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import RelativeDate from '~/components/UI/RelativeDate.vue'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import { siteStore } from '~/stores/site'

const PointTime = [/^collection_times$/, /^service_times$/]

// List of tag keys regex copied from opening_hours.js
const SupportedOsmKeys = [
  ...PointTime,
  /^opening_hours$/,
  /^opening_hours:.+/,
  /.+:opening_hours$/,
  /.+:opening_hours:.+/,
  /^smoking_hours$/,
  /^happy_hours$/,
  /^lit$/,
]

function isSupportedOsmTags(keys: RegExp[], key: string): boolean {
  return keys.some(regexKey => regexKey.test(key))
}

export function isOpeningHoursSupportedOsmTags(key: string): boolean {
  return isSupportedOsmTags(SupportedOsmKeys, key)
}

export default defineNuxtComponent({
  components: {
    RelativeDate,
  },

  props: {
    context: {
      type: String as PropType<PropertyTranslationsContextEnum>,
      required: true,
    },
    tagKey: {
      type: String as PropType<string>,
      required: true,
    },
    openingHours: {
      type: String as PropType<string>,
      required: true,
    },
    baseDate: {
      type: Date as PropType<Date>,
      default: () => new Date(),
    },
  },

  computed: {
    ...mapState(siteStore, ['locale', 'settings']),

    isPointTime(): boolean {
      return isSupportedOsmTags(PointTime, this.tagKey)
    },

    comment() {
      const oh = this.OpeningHoursFactory()
      return oh?.getComment(this.baseDate)
    },

    isCompact(): boolean {
      return this.context === PropertyTranslationsContextEnum.Card
    },

    pretty(): [string | undefined, string[]][] | undefined {
      const oh = this.OpeningHoursFactory()
      if (oh) {
        let prettyString
        try {
          prettyString = oh
            .prettifyValue({
              // @ts-expect-error: Fix typings
              conf: {
                locale: this.locale || 'en',
                rule_sep_string: '\n',
                print_semicolon: false,
              },
            })
            .replace(/(^\w|\s\w)/g, c => c.toUpperCase())
            .split('\n')
        }
        catch (e) {
          return undefined
        }
        if (!this.variable) {
          return [[undefined, prettyString]]
        }
        else {
          const ret: [string | undefined, string[]][] = []
          // Stable group by month
          prettyString
            .map(
              row =>
                (row.includes(': ')
                  ? [
                      row.slice(0, row.indexOf(': ')),
                      row.slice(row.indexOf(': ') + 1 + 1),
                    ]
                  : [undefined, row]) as [string | undefined, string],
            )
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
      else {
        return undefined
      }
    },

    variable(): boolean {
      const oh = this.OpeningHoursFactory()
      try {
        return !oh?.isWeekStable()
      }
      catch (e) {
        return false
      }
    },

    nextChange():
      | undefined
      | {
        type: 'opened' | 'openAt'
        nextChange: Date
      } {
      const oh = this.OpeningHoursFactory()
      if (oh) {
        try {
          const nextChange = oh.getNextChange(this.baseDate)
          if (nextChange) {
            return {
              type: oh.getState(this.baseDate) ? 'opened' : 'openAt',
              nextChange,
            }
          }
        }
        catch (e) {
          return undefined
        }
      }
      return undefined
    },
  },

  methods: {
    OpeningHoursFactory(): OpeningHours | undefined {
      try {
        // https://github.com/opening-hours/opening_hours.js/issues/428
        // @ts-expect-error: Fix typings
        const optionalConf: optional_conf = {
          tag_key: this.tagKey,
        }
        return new OpeningHours(
          this.openingHours,
          {
            lon:
              (this.settings!.bbox_line.coordinates[0][1]
              + this.settings!.bbox_line.coordinates[1][1])
              / 2,
            lat:
              (this.settings!.bbox_line.coordinates[0][0]
              + this.settings!.bbox_line.coordinates[1][0])
              / 2,
            address: {
              country_code: this.settings!.default_country,
              state: this.settings!.default_country_state_opening_hours,
            },
          },
          optionalConf,
        )
      }
      catch (e) {}
    },
  },
})
</script>

<template>
  <div v-if="openingHours">
    <span hidden>{{ openingHours }}</span>
    <template v-if="nextChange">
      <p v-if="isPointTime" id="next" class="tw-text-emerald-500">
        {{ $t('openingHours.next') }}
        <RelativeDate :date="nextChange.nextChange" />
      </p>
      <template v-else>
        <p
          v-if="nextChange.type === 'opened'"
          id="opened"
          class="tw-text-emerald-500"
        >
          {{ $t('openingHours.opened') }}
          <template v-if="nextChange.nextChange">
            -
            {{ $t('openingHours.closeAt') }}
            <RelativeDate :date="nextChange.nextChange" />
          </template>
        </p>
        <p
          v-else-if="nextChange.type === 'openAt'"
          id="openAt"
          class="tw-text-red-500"
        >
          {{ $t('openingHours.closed') }}
          <template v-if="nextChange.nextChange">
            -
            {{ $t('openingHours.openAt') }}
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
        <p>{{ $t('openingHours.variableWeek') }}</p>
      </template>
    </template>
    <template v-if="isCompact && comment">
      <p>{{ comment }}</p>
    </template>
  </div>
</template>
