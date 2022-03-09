<template>
  <span />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  validate({ params }) {
    return (
      /^[-_:a-zA-Z0-9,]+$/.test(params.categoryIds) &&
      /^[-_:a-zA-Z0-9]+$/.test(params.poiId)
    )
  },
})
</script>
