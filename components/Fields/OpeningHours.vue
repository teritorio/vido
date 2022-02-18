<template>
  <div>
    <span
      v-if="format"
      :class="[
        (format.includes($tc('openingHours.opened')) ||
          format === $tc('openingHours.24_7')) &&
          'text-green-500',
        format.includes($tc('openingHours.closed')) && 'text-red-500',
      ]"
    >
      {{ format }}
    </span>
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
    format(): string | null {
      try {
        const oh = new OpeningHours(this.openingHours)
        const nextchange = oh.getNextChange()

        if (oh.getState() && nextchange === undefined) {
          return this.$tc('openingHours.24_7')
        } else if (oh.getState()) {
          return `${this.$tc('openingHours.opened')} - ${this.$tc(
            'openingHours.closeAt'
          )} ${this.displayTime(nextchange)}`
        }

        const nextChange = new Date(nextchange || '')
        const today = new Date()
        const todayDay = today.getDay()
        const day = nextChange.getDay()

        const openTrad =
          todayDay === day
            ? `${this.$tc('openingHours.openAt')} ${this.displayTime(
                nextchange
              )}`
            : `${this.$tc('openingHours.open')} ${
                this.days[day]
              } ${this.displayTime(nextchange)}`

        return `${this.$tc('openingHours.closed')} - ${openTrad}`
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
    displayTime(dateGMT: Date | string | undefined): string {
      if (dateGMT) {
        const date = new Date(dateGMT)

        const hh = date.getHours()
        const mm = date.getMinutes()

        return `${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}`
      } else {
        return ''
      }
    },
  },
})
</script>
