<template>
  <div v-if="openingHours">
    <template v-if="format">
      <span v-if="format.type === '24_7'" class="text-emerald-500">
        {{ $tc('openingHours.24_7') }}
      </span>
      <span v-else-if="format.type === 'opened'" class="text-emerald-500">
        {{ $tc('openingHours.opened') }} -
        {{ $tc('openingHours.closeAt') }}
        {{ displayTime(format.nextChange) }}
      </span>
      <span v-else-if="format.type === 'openAt'" class="text-red-500">
        {{ $tc('openingHours.closed') }} -
        {{ $tc('openingHours.openAt') }}
        {{ displayTime(format.nextChange) }}
      </span>
    </template>
    <ul v-if="details">
      <li v-for="(timeline, i) in schedule" :key="`timeline_${i}`" class="mt-1">
        {{ timeline }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import OpeningHours from 'opening_hours'
import Vue from 'vue'

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
  data() {
    return {
      days: [
        this.$tc('openingHours.sunday'),
        this.$tc('openingHours.monday'),
        this.$tc('openingHours.tuesday'),
        this.$tc('openingHours.wednesday'),
        this.$tc('openingHours.thursday'),
        this.$tc('openingHours.friday'),
        this.$tc('openingHours.saturday'),
      ],
    }
  },
  computed: {
    format(): null | {
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
        const oh = new OpeningHours(this.openingHours)

        const from = new Date()
        from.setDate(from.getDate() + ((7 - from.getDay()) % 7 || 7))

        const to = new Date(from)
        to.setDate(to.getDate() + 7)

        const intervals = oh.getOpenIntervals(from, to)
        const sortedIntervals: string[] = []

        intervals.forEach((interval, i) => {
          if (
            i > 0 &&
            interval[0].getDate() === intervals[i - 1][0].getDate()
          ) {
            sortedIntervals[
              sortedIntervals.length - 1
            ] += ` / ${this.displayTime(interval[0])}-${this.displayTime(
              interval[1]
            )}`
          } else {
            sortedIntervals.push(
              `${this.days[interval[0].getDay()]} ${this.displayTime(
                interval[0]
              )}-${this.displayTime(interval[1])}`
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
    displayTime(dateGMT: Date): string {
      let ret = ''
      if (dateGMT) {
        const date = new Date(dateGMT)

        const today = new Date()
        const todayDay = today.getDay()
        const day = date.getDay()

        if (todayDay !== day) {
          ret += this.days[day] + ' '
        }

        const hh = date.getHours()
        const mm = date.getMinutes()
        ret += `${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}`
      }
      return ret
    },
  },
})
</script>
