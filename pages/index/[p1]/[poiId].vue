<template>
  <span />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { definePageMeta } from '#imports'

export default defineComponent({
  setup() {
    definePageMeta({
      validate({ params }) {
        return (
          typeof params.p1 === 'string' &&
          typeof params.poiId === 'string' &&
          /^[-_:a-zA-Z0-9,]/.test(params.p1) &&
          /^[-_:a-zA-Z0-9]+$/.test(params.poiId)
        )
      },
    })
  },
})
</script>
