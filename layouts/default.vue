<script lang="ts">
import '~/assets/tailwind.scss'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({})
</script>

<template>
  <div class="v-locale--is-ltr">
    <slot />
  </div>
</template>
