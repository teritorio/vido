<script setup lang="ts">
import OpeningHours from '~/components/Fields/OpeningHours.vue'
import { PropertyTranslationsContextEnum } from '~/stores/site'

const props = withDefaults(defineProps<{
  start?: string
  end?: string
  openingHours?: string
  context?: PropertyTranslationsContextEnum
}>(), {
  context: PropertyTranslationsContextEnum.Default,
})

const { t, d } = useI18n()
</script>

<template>
  <div>
    <slot />
    <span v-if="!props.openingHours">
      <template v-if="props.start && props.end && props.start === props.end">
        {{
          t('dateRange.on', {
            on: d(new Date(props.start)),
          })
        }}
      </template>
      <template v-else-if="props.start && props.end">
        {{
          t('dateRange.from_to', {
            from: d(new Date(props.start)),
            to: d(new Date(props.end)),
          })
        }}
      </template>
      <template v-else-if="props.start">
        {{ t('dateRange.from', { from: d(new Date(props.start)) }) }}
      </template>
      <template v-else-if="props.end">
        {{ t('dateRange.to', { to: d(new Date(props.end)) }) }}
      </template>
    </span>
    <OpeningHours
      v-if="props.openingHours && props.context !== PropertyTranslationsContextEnum.List"
      :opening-hours="props.openingHours"
      :context="props.context"
      render-key="osm:opening_hours@event"
    />
  </div>
</template>
