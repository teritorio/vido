<template>
  <div>
    <slot />
    <span>
      <template v-if="start && end && start == end">
        {{
          $t('dateRange.on', {
            on: $d(new Date(start)),
          })
        }}
      </template>
      <template v-else-if="start && end">
        {{
          $t('dateRange.from_to', {
            from: $d(new Date(start)),
            to: $d(new Date(end)),
            duration: $n(
              (new Date(end) - new Date(start)) / 1000 / 60 / 60 / 24
            ),
          })
        }}
      </template>
      <template v-else-if="start">
        {{ $t('dateRange.from', { from: $d(new Date(start)) }) }}
      </template>
      <template v-else-if="end">
        {{ $t('dateRange.to', { to: $d(new Date(end)) }) }}
      </template>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export function isDateRangeEmpty(properties: {
  [key: string]: string
}): boolean {
  return !('start' in properties) && !('end' in properties)
}

export default Vue.extend({
  props: {
    start: {
      type: String,
      default: null,
    },
    end: {
      type: String,
      default: null,
    },
  },
})
</script>
