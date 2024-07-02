<script setup lang="ts">
//
// Validators
//
definePageMeta({
  validate({ params }) {
    return (
      typeof params.p1 === 'string'
      && typeof params.poiId === 'string'
      && /^[0-9,]+$/.test(params.p1)
      && /^[-\w:]+$/.test(params.poiId)
    )
  },
})
</script>

<template>
  <span />
</template>
