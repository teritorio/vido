<template>
  <button
    v-if="!href"
    :aria-label="ariaLabel"
    type="button"
    class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </button>
  <NuxtLink
    v-else-if="!href.startsWith('http://') && !href.startsWith('https://')"
    :aria-label="ariaLabel"
    :to="href"
    :target="target"
    class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </NuxtLink>
  <a
    v-else
    :aria-label="ariaLabel"
    :href="href"
    :target="target"
    class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </a>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    ariaLabel: {
      type: String as PropType<string>,
      required: true,
    },
    href: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    target: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },
})
</script>
