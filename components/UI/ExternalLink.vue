<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :rel="rel"
    :title="title"
    class="flex flex-row items-center gap-x-2.5"
  >
    <font-awesome-icon icon="external-link-alt" color="inherit" size="sm" />
    <slot />
  </a>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    href: {
      type: String,
      required: true,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      default: '_blank',
    },
    rel: {
      type: String,
      default: null,
    },
  },
})
</script>

<style scoped>
a {
  text-decoration: underline;
}
</style>
