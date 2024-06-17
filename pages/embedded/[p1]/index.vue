<script setup lang="ts">
//
// Validators
//
definePageMeta({
  validate({ params }) {
    return (
      params.p1 === undefined
      || (typeof params.p1 === 'string' && /^[0-9,]+$/.test(params.p1))
    )
  },
})
</script>

<template>
  <span />
</template>
