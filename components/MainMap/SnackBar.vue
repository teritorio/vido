<template>
  <div class="fixed w-full bottom-4 left-0 flex justify-center z-20">
    <transition name="snack">
      <div
        v-if="text"
        class="bg-zinc-600 text-white px-8 py-2 rounded-lg text-sm flex text-sm mx-4"
      >
        <p class="pr-10 self-center">{{ text }}</p>
        <button
          type="button"
          class="font-medium text-zinc-800 bg-white rounded-full shadow-md outline-none px-5 sm:w-auto h-11 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100"
          @click="callback"
        >
          {{ textBtn }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import Vue from 'vue'

import { snackStore } from '~/stores/snack'

export default Vue.extend({
  computed: {
    ...mapState(snackStore, ['snack']),

    text(): string | undefined {
      return this.snack?.text
    },
    textBtn(): string | undefined {
      return this.snack?.textBtn
    },
  },

  methods: {
    callback() {
      this.snack && this.$emit('click')
    },
  },
})
</script>

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
