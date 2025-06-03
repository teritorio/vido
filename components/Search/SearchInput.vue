<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

withDefaults(defineProps<{
  searchText: string
  isLoading: boolean
}>(), {
  searchText: '',
  isLoading: false,
})

const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'focus', event: string | Event): void
  (e: 'blur', event: FocusEvent): void
}>()
const { $tracking } = useNuxtApp()
const searchRef = ref<InstanceType<typeof HTMLInputElement>>()

function onFocus(event: string | Event) {
  emit('focus', event)
  $tracking({ type: 'search' })
}
</script>

<template>
  <form
    class="tw-flex-grow tw-relative tw-pointer-events-auto tw-w-full"
    @submit.prevent
  >
    <section class="tw-relative tw-w-full">
      <label>
        <span class="tw-sr-only">{{ $t('headerMenu.searchHint') }}</span>
        <input
          ref="searchRef"
          name="search"
          :value="searchText"
          class="tw-w-full tw-px-5 tw-py-3 tw-font-medium tw-text-zinc-700 tw-placeholder-zinc-500 tw-bg-zinc-100 tw-border-none tw-rounded-full tw-outline-none tw-appearance-none focus:tw-outline-none focus:tw-ring focus:tw-ring-zinc-300 tw-truncate tw-pr-10"
          :placeholder="$t('headerMenu.searchHint')"
          type="text"
          @input="
            //@ts-ignore
            $emit('input', $event.target.value)
          "
          @focus="onFocus"
          @blur="$emit('blur', $event)"
        >
      </label>
      <button
        class="tw-absolute tw-inset-y-0 tw-right-0 tw-px-5 tw-text-zinc-800 tw-rounded-r-full tw-outline-none focus:tw-outline-none"
        style="pointer-events: none"
        type="submit"
      >
        <span class="tw-sr-only">{{ $t('headerMenu.search') }}</span>
        <FontAwesomeIcon v-if="!isLoading" icon="search" />
        <FontAwesomeIcon v-else icon="spinner" class="tw-animate-spin" />
      </button>
    </section>
  </form>
</template>
