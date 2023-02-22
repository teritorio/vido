<template>
  <span />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  validate({ params }) {
    return /^[0-9,]+$/.test(params.p1) && /^[-_:a-zA-Z0-9]+$/.test(params.poiId)
  },
})
</script>
