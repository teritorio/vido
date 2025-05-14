<script setup lang="ts">
import { formatRelative } from 'date-fns'
import { enGB, es, fr } from 'date-fns/locale'

const props = defineProps<{
  date: Date | string
}>()

const DateFormatLocales: { [key: string]: Locale } = { en: enGB, fr, es }

const { locale } = useI18n()

const formatLocale = computed((): { locale: Locale } => {
  return {
    locale: (locale.value && DateFormatLocales[locale.value]) || enGB,
  }
})
function displayTime(): string {
  const today = new Date()
  return formatRelative(new Date(props.date), today, formatLocale.value)
}
</script>

<template>
  <span>{{ displayTime() }}</span>
</template>
