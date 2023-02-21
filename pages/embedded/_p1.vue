<template>
  <span />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  validate({ params }) {
    return params.p1 === undefined || /^[0-9,]+$/.test(params.p1)
  },
})
</script>
