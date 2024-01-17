<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export function isDateRangeEmpty(properties: {
  [key: string]: string
}): boolean {
  return !('start' in properties) && !('end' in properties)
}

export default defineNuxtComponent({
  props: {
    start: {
      type: String as PropType<string>,
      default: null,
    },
    end: {
      type: String as PropType<string>,
      default: null,
    },
  },
})
</script>

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
              (new Date(end).getTime() - new Date(start).getTime())
                / 1000
                / 60
                / 60
                / 24,
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
