<template>
  <button
    v-if="!href"
    :aria-label="ariaLabel"
    type="button"
    class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
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
    <slot />
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
    <slot />
  </a>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    ariaLabel: {
      type: String,
      required: true,
    },
    href: {
      type: String as PropType<String | undefined>,
      required: false,
    },
    target: {
      type: String as PropType<String | undefined>,
      required: false,
    },
  },
})
</script>
