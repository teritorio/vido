<template>
  <div>
    <span
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
      <li>DETAILS TODO</li>
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

  computed: {
    format(): string | string[] | null {
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

        const days = [
          this.$tc('openingHours.sunday'),
          this.$tc('openingHours.monday'),
          this.$tc('openingHours.tuesday'),
          this.$tc('openingHours.wednesday'),
          this.$tc('openingHours.thursday'),
          this.$tc('openingHours.friday'),
          this.$tc('openingHours.saturday'),
        ]

        const openTrad =
          todayDay === day
            ? `${this.$tc('openingHours.openAt')} ${this.displayTime(
                nextchange
              )}`
            : `${this.$tc('openingHours.open')} ${days[day]} ${this.displayTime(
                nextchange
              )}`

        return `${this.$tc('openingHours.closed')} - ${openTrad}`
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Vido error:', e)
        return null
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
