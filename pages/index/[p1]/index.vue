<script setup lang="ts">
//
// Validators
//
definePageMeta({
  validate: ({ params }) => {
    const regexForIds = /^(?:cartocode:\w{2}|ref:[\w-]+:\w+|osm:[nwr]\d+|\d+(?:,\d+)*)$/

    return regexForIds.test(params.p1.toString())
  },
})
</script>

<template>
  <span />
</template>
