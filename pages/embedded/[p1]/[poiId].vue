<script setup lang="ts">
import { regexForCategoryIds, regexForPOIIds } from '~/composables/useIdsResolver'

//
// Validators
//
definePageMeta({
  validate: ({ params }) => {
    const match = params.p1.toString().match(regexForCategoryIds)

    if (match?.groups && (match.groups.cartocode || match.groups.reference || match.groups.osm)) {
      return false
    }

    return regexForCategoryIds.test(params.p1.toString()) && regexForPOIIds.test(params.poiId.toString())
  },
})
</script>

<template>
  <span />
</template>
