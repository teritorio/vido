<template>
  <form class="flex-grow relative pointer-events-auto w-full" @submit.prevent>
    <section class="relative w-full">
      <label>
        <span class="sr-only">{{ $tc('headerMenu.searchHint') }}</span>
        <input
          ref="search"
          :value="searchText"
          class="w-full px-5 py-3 font-medium text-zinc-700 placeholder-zinc-500 bg-zinc-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-zinc-300 truncate pr-10"
          :placeholder="$tc('headerMenu.searchHint')"
          type="text"
          @input="
            //@ts-ignore
            $emit('input', $event.target.value)
          "
          @focus="onFocus"
          @blur="$emit('blur', $event)"
        />
      </label>
      <button
        class="absolute inset-y-0 right-0 px-5 text-zinc-800 rounded-r-full outline-none focus:outline-none"
        style="pointer-events: none"
        type="submit"
      >
        <span class="sr-only">{{ $tc('headerMenu.search') }}</span>
        <font-awesome-icon v-if="!isLoading" icon="search" />
        <font-awesome-icon v-else icon="spinner" class="animate-spin" />
      </button>
    </section>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  props: {
    searchText: {
      type: String as PropType<string>,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      search: ref<InstanceType<typeof HTMLInputElement>>(),
    }
  },

  methods: {
    onFocus(event: Event) {
      this.$emit('focus', event)
      this.$tracking({ type: 'search' })
    },
  },
})
</script>
