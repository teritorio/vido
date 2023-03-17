<template>
  <span>{{ displayTime() }}</span>
</template>

<script lang="ts">
import { formatRelative } from 'date-fns'
import { enGB, fr, es } from 'date-fns/locale'
import { mapState } from 'pinia'
import Vue from 'vue'

import { siteStore } from '~/stores/site'

const DateFormatLocales: { [key: string]: Locale } = { en: enGB, fr, es }

export default Vue.extend({
  props: {
    date: {
      type: [Date, String],
      required: true,
    },
  },

  computed: {
    ...mapState(siteStore, ['locale']),

    formatLocale(): { locale: Locale } {
      return {
        locale: (this.locale && DateFormatLocales?.[this.locale]) || enGB,
      }
    },
  },

  methods: {
    displayTime(): string {
      const today = new Date()
      return formatRelative(new Date(this.date), today, this.formatLocale)
    },
  },
})
</script>
