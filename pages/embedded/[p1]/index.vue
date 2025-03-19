<script setup lang="ts">
import { regexForCategoryIds } from '~/composables/useIdsResolver'

//
// Validators
//
definePageMeta({
  validate: ({ params }) => {
    return !!params.catIds && regexForCategoryIds.test(params.catIds.toString())
  },
})
</script>

<template>
  <span />
</template>
