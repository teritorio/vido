<script setup lang="ts">
import OpeningHours from '~/components/Fields/OpeningHours.vue'
import { PropertyTranslationsContextEnum } from '~/stores/site'
import type { AssocRenderKey } from '~/utils/types'

withDefaults(defineProps<{
  start?: string
  end?: string
  openingHours?: string
  context?: PropertyTranslationsContextEnum
}>(), {
  context: PropertyTranslationsContextEnum.Default,
})

const eventRenderKey: AssocRenderKey = 'osm:opening_hours@event'
const { t, d } = useI18n()
</script>

<template>
  <div>
    <slot />
    <span v-if="!openingHours">
      <template v-if="start && end && start === end">
        {{
          t('dateRange.on', {
            on: d(new Date(start)),
          })
        }}
      </template>
      <template v-else-if="start && end">
        {{
          t('dateRange.from_to', {
            from: d(new Date(start)),
            to: d(new Date(end)),
          })
        }}
      </template>
      <template v-else-if="start">
        {{ t('dateRange.from', { from: d(new Date(start)) }) }}
      </template>
      <template v-else-if="end">
        {{ t('dateRange.to', { to: d(new Date(end)) }) }}
      </template>
    </span>
    <OpeningHours
      v-if="openingHours && context !== PropertyTranslationsContextEnum.List"
      :opening-hours="openingHours"
      :context="context"
      :render-key="eventRenderKey"
    />
  </div>
</template>
