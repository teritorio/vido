<script setup lang="ts">
import { regexForCategoryIds } from '~/composables/useIdsResolver'

//
// Validators
//
definePageMeta({
  validate: ({ params }) => {
    return !!params.p1 && regexForCategoryIds.test(params.p1.toString())
  },
})
</script>

<template>
  <span />
</template>
