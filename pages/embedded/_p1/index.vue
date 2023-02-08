<template>
  <span />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  validate({ params }) {
    return params.p1 === undefined || /^[0-9,]+$/.test(params.p1)
  },
})
</script>
