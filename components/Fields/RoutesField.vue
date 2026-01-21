<script setup lang="ts">
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import { PropertyTranslationsContextEnum, useSiteStore } from '~/stores/site'
import type { ApiPoiPropertiesRoute, RouteMetadata } from '~/types/api/poi'

const props = withDefaults(defineProps<{
  context: PropertyTranslationsContextEnum
  recursionStack?: string[]
  properties: ApiPoiPropertiesRoute
}>(), {
  recursionStack: () => [],
})

const { pv } = useSiteStore()
const { t, locale } = useI18n()

const isCompact = computed(() => {
  return props.context === PropertyTranslationsContextEnum.Card
})

const routes = computed((): Record<string, RouteMetadata> => {
  const entries = Object.entries(props.properties['fr-FR']!)

  return Object.fromEntries(entries.filter(([key, _value]) => !['gpx_trace', 'pdf'].includes(key))) as Record<string, RouteMetadata>
})

function formatDuration(duration: number): string | undefined {
  if (!duration)
    return undefined

  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  const formatter = new Intl.NumberFormat(locale.value, {
    style: 'unit',
    unit: 'hour',
    unitDisplay: 'narrow',
  })

  const formattedHours = hours > 0 ? formatter.format(hours) : ''
  const formattedMinutes = minutes > 0
    ? new Intl.NumberFormat(locale.value, {
      style: 'unit',
      unit: 'minute',
      unitDisplay: 'narrow',
    }).format(minutes)
    : ''

  return `${formattedHours} ${formattedMinutes}`.trim()
}

function formatLength(length: number): string | undefined {
  return new Intl.NumberFormat(locale.value, { style: 'unit', unit: 'kilometer' }).format(length)
}
</script>

<template>
  <div>
    <slot />
    <div v-if="isCompact">
      <p v-for="(route, activity) in routes" :key="activity">
        {{ pv('route', `${activity}`, context) }} : {{ formatDuration(route.duration) }}, {{ pv(`route:${activity}:difficulty`, route.difficulty, context) }}.
        <br>
        <span v-if="route.length">
          {{ formatLength(route.length) }}
        </span>
      </p>
    </div>
    <div v-else>
      <div v-for="(route, activity, index) in routes" :key="activity" class="field">
        <div v-if="route.length && index === 0" class="field">
          {{ t('fields.route.length', { length: formatLength(route.length) }) }}
        </div>
        <FieldsHeader
          :recursion-stack="[...recursionStack, `${activity}`]"
          :class="`field_header_level_${[...recursionStack, activity].length}`"
        >
          {{ pv('route', `${activity}`, context) }}
        </FieldsHeader>
        <ul class="tw-list-disc tw-ml-6">
          <li v-if="route.difficulty">
            {{ t('fields.route.difficulty', { difficulty: pv(`route:${activity}:difficulty`, route.difficulty, context) }) }}
          </li>
          <li v-if="route.duration">
            {{ t('fields.route.duration', { duration: formatDuration(route.duration) }) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
