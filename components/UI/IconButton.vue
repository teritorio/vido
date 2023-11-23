<template>
  <button
    v-if="!href"
    :aria-label="label"
    type="button"
    class="tw-text-sm tw-text-zinc-800 tw-bg-white tw-rounded-full tw-shadow-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-shrink-0 tw-flex tw-items-center tw-justify-center tw-px-2.5 tw-gap-2"
  >
    <slot></slot>
  </button>
  <NuxtLink
    v-else-if="!href.startsWith('http://') && !href.startsWith('https://')"
    :aria-label="label"
    :to="href"
    :target="target"
    class="tw-text-sm tw-text-zinc-800 tw-bg-white tw-rounded-full tw-shadow-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-shrink-0 tw-flex tw-items-center tw-justify-center tw-px-2.5 tw-gap-2"
  >
    <slot></slot>
  </NuxtLink>
  <a
    v-else
    :aria-label="label"
    :href="href"
    :target="target"
    class="tw-text-sm tw-text-zinc-800 tw-bg-white tw-rounded-full tw-shadow-md tw-outline-none focus:tw-outline-none hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100 tw-shrink-0 tw-flex tw-items-center tw-justify-center tw-px-2.5 tw-gap-2"
  >
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    label: {
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
