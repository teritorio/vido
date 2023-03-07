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
          typeof params.p1 === undefined ||
          (typeof params.p1 === 'string' && /^[0-9,]+$/.test(params.p1))
        )
      },
    })
  },
})
</script>
