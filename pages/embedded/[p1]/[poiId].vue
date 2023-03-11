<template>
  <span />
</template>

<script lang="ts">
import { defineNuxtComponent } from '#app'
import { definePageMeta } from '#imports'

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      validate({ params }) {
        return (
          typeof params.p1 === 'string' &&
          typeof params.poiId === 'string' &&
          /^[0-9,]+$/.test(params.p1) &&
          /^[-_:a-zA-Z0-9]+$/.test(params.poiId)
        )
      },
    })
  },
})
</script>
