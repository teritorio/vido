<template>
  <div class="fixed w-full bottom-4 left-0 flex justify-center z-20">
    <transition name="snack">
      <div
        v-if="text"
        class="bg-gray-600 text-white px-8 py-2 rounded-lg text-sm flex text-sm mx-4"
      >
        <p class="pr-10 self-center">{{ text }}</p>
        <button
          class="font-medium text-gray-800 bg-white rounded-full shadow-md outline-none px-5 sm:w-auto h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
          @click="callback"
        >
          {{ textBtn }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  data(): {
    sptags: { [key: string]: any } | null
    apiProps: { [key: string]: any } | null
  } {
    return {
      sptags: null,
      apiProps: null,
    }
  },

  computed: {
    ...mapGetters({
      snack: 'snack/snack',
    }),

    text(): string {
      return this.snack?.text
    },
    textBtn(): string {
      return this.snack?.textBtn
    },
  },

  methods: {
    callback() {
      this.snack && this.$emit('snack-action-click')
    },
  },
})
</script>
<style>
.snack-enter-active,
.snack-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.snack-enter {
  opacity: 0;
  transform: translateY(20px);
}

.snack-enter-to,
.snack-leave {
  opacity: 1;
  transform: translateX(0);
}

.snack-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
