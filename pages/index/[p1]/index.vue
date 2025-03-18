<script setup lang="ts">
import { regexForCategoryIds } from '~/composables/useIdsResolver'

//
// Validators
//
definePageMeta({
  validate: ({ params, path }) => {
    if (!params.p1)
      return false

    const p1Str = params.p1.toString()
    const match = p1Str.match(regexForCategoryIds)

    if (!match
      || (path.endsWith('/')
      && match.groups
      && (match.groups.cartocode || match.groups.reference || match.groups.osm))
    ) {
      return false
    }

    return regexForCategoryIds.test(p1Str)
  },
})
</script>

<template>
  <span />
</template>
