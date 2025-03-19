<script setup lang="ts">
import { regexForCategoryIds, regexForPOIIds } from '~/composables/useIdsResolver'

//
// Validators
//
definePageMeta({
  validate: ({ params }) => {
    const match = params.catIds.toString().match(regexForCategoryIds)

    if (match?.groups && (match.groups.cartocode || match.groups.reference || match.groups.osm)) {
      return false
    }

    return !!params.catIds && !!params.poiId && regexForCategoryIds.test(params.catIds.toString()) && regexForPOIIds.test(params.poiId.toString())
  },
})
</script>

<template>
  <span />
</template>
