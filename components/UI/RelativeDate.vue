<script lang="ts">
import { formatRelative } from 'date-fns'
import { enGB, es, fr } from 'date-fns/locale'
import { mapState } from 'pinia'

import { defineNuxtComponent } from '#app'
import { useSiteStore } from '~/stores/site'

const DateFormatLocales: { [key: string]: Locale } = { en: enGB, fr, es }

export default defineNuxtComponent({
  props: {
    date: {
      type: [Date, String],
      required: true,
    },
  },

  computed: {
    ...mapState(useSiteStore, ['locale']),

    formatLocale(): { locale: Locale } {
      return {
        locale: (this.$i18n.locale && DateFormatLocales?.[this.$i18n.locale]) || enGB,
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

<template>
  <span>{{ displayTime() }}</span>
</template>
