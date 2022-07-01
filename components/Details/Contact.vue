<template>
  <Block
    v-if="p.website || p.phone || p.email"
    :color-fill="colorFill"
    image-url="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE7WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTEwLTA2VDE3OjQ2OjI3KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0xMC0wNlQxNzo1MzozNiswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0xMC0wNlQxNzo1MzozNiswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZDc3MmVhMTctMDQxNy00MDQ3LTkxM2YtYmJmMmMwZGI0MzMwIiB4bXBNTTpEb2N1bWVudElEPSJ4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')"
  >
    <h2>{{ $tc('details.headerContacts') }}</h2>
    <p v-for="phone in p.phone || []" :key="phone" class="item">
      <a v-if="$screen.phone" :href="`tel:${phone}`">
        {{ phone }}
      </a>
      <template v-else>
        {{ phone }}
      </template>
    </p>
    <p v-for="email in p.email || []" :key="email" class="item">
      <a :href="`mailto:${email}`">
        {{ email }}
      </a>
    </p>
    <p v-for="website in p.website || []" :key="website" class="item">
      <a :href="p.website" target="_blank">
        {{ website }}
      </a>
    </p>
  </Block>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Block from '@/components/Details/Block.vue'
import { ApiPoiProperties } from '@/lib/apiPois'

export default Vue.extend({
  components: {
    Block,
  },

  props: {
    p: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    colorFill: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="css" scoped>
.item {
  font-size: 1rem;
  margin-bottom: 0.27rem;
}
</style>
