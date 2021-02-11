<template>
  <LogoSvg class="text-gray-900" aria-label="Landes, Terre des possibles" />
</template>

<script lang="ts">
import Vue from 'vue'

import LogoSvg from '@/assets/logo-white.svg?inline'

export default Vue.extend({
  components: {
    LogoSvg,
  },
})
</script>
