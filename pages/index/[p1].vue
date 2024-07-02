<script setup lang="ts">
//
// Validators
//
definePageMeta({
  validate({ params }) {
    return (
      typeof params.p1 === 'undefined'
      || (typeof params.p1 === 'string'
      && /^[-\w:,]+$/.test(params.p1))
    )
  },
})
</script>

<template>
  <span />
</template>
