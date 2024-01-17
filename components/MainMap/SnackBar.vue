<script lang="ts">
import { mapState } from 'pinia'

import { defineNuxtComponent } from '#app'
import { snackStore } from '~/stores/snack'

export default defineNuxtComponent({
  computed: {
    ...mapState(snackStore, ['snack']),

    text(): string | undefined {
      return this.snack?.text
    },
    textBtn(): string | undefined {
      return this.snack?.textBtn
    },
  },

  emits: {
    click: () => true,
  },

  methods: {
    callback() {
      this.snack && this.$emit('click')
    },
  },
})
</script>

<template>
  <div
    class="tw-fixed tw-w-full tw-bottom-4 tw-left-0 tw-flex tw-justify-center tw-z-20"
  >
    <transition name="snack">
      <div
        v-if="text"
        class="tw-bg-zinc-600 tw-text-white tw-px-8 tw-py-2 tw-rounded-lg tw-text-sm tw-flex tw-text-sm tw-mx-4"
      >
        <p class="tw-pr-10 tw-self-center">
          {{ text }}
        </p>
        <button
          type="button"
          class="tw-font-medium tw-text-zinc-800 tw-bg-white tw-rounded-full tw-shadow-md tw-outline-none tw-px-5 sm:tw-w-auto tw-h-11 focus:tw-outline-none hover:tw-bg-zinc-100 focus-visible:tw-bg-zinc-100"
          @click="callback"
        >
          {{ textBtn }}
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
:deep(.snack-enter-active),
:deep(.snack-leave-active) {
  transition: opacity 0.5s, transform 0.5s;
}

:deep(.snack-enter) {
  opacity: 0;
  transform: translateY(20px);
}

:deep(.snack-enter-to),
:deep(.snack-leave) {
  opacity: 1;
  transform: translateX(0);
}

:deep(.snack-leave-to) {
  opacity: 0;
  transform: translateY(20px);
}
</style>
