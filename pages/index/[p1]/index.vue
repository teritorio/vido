<script lang="ts">
import { defineNuxtComponent } from '#app'
import { definePageMeta } from '#imports'

export default defineNuxtComponent({
  setup() {
    definePageMeta({
      validate({ params }) {
        return (
          params.p1 === undefined
          || (typeof params.p1 === 'string'
          && /^[-\w:,]+$/.test(params.p1))
        )
      },
    })
  },
})
</script>

<template>
  <span />
</template>
