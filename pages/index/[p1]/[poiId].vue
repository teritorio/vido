<script setup lang="ts">
//
// Validators
//
definePageMeta({
  validate: ({ params }) => {
    const regexForCategoryIds = /^(?:(?<cartocode>cartocode:\w{2})|(?<reference>ref:[\w-]+:\w+)|(?<osm>osm:[nwr]\d+)|\d+(?:,\d+)*)$/
    const regexForPOIIds = /^(?:cartocode:\w{2}|ref:[\w-]+:\w+|osm:[nwr]\d+|\d+)$/
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
