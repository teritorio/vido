<script setup lang="ts">
//
// Validators
//
definePageMeta({
  validate: ({ params }) => {
    const regexForIds = /^(?:cartocode:[a-zA-Z0-9]{2}|ref:[a-z0-9-]+:[a-zA-Z0-9]+|osm:[nwr]\d+|\d+(?:,\d+)*)$/

    return regexForIds.test(params.p1.toString())
  },
})
</script>

<template>
  <span />
</template>
