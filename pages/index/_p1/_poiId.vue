<template>
  <span />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  validate({ params }) {
    return /^[0-9,]+$/.test(params.p1) && /^[-_:a-zA-Z0-9]+$/.test(params.poiId)
  },
})
</script>
