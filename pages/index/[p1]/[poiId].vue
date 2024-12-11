<script setup lang="ts">
//
// Validators
//
definePageMeta({
  validate: ({ params }) => {
    const regexForCategoryIds = /^(?:(?<cartocode>cartocode:[a-zA-Z0-9]{2})|(?<reference>ref:[a-z0-9-]+:[a-zA-Z0-9]+)|(?<osm>osm:[nwr]\d+)|\d+(?:,\d+)*)$/
    const regexForPOIIds = /^(?:cartocode:[a-zA-Z0-9]{2}|ref:[a-z0-9-]+:[a-zA-Z0-9]+|osm:[nwr]\d+|\d+)$/
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
