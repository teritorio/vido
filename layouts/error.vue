<template>
  <div class="flex h-screen">
    <div class="m-auto">
      <h1 v-if="error.statusCode === 404">404<br />Page not found</h1>
      <h1 v-else>An error occurred - {{ error.statusCode }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  layout: 'error-layout',

  props: {
    error: {
      type: Object,
      required: true,
    },
  },
})
</script>
