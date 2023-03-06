<template>
  <button
    type="button"
    class="flex items-center border-solid border-zinc-300 border-2 bg-white focus:outline-none focus-visible:bg-zinc-100 hover:bg-zinc-100 py-2 px-4 rounded-full"
    v-on="$listeners"
  >
    <font-awesome-icon
      v-if="icon"
      ref="menu_icon"
      :icon="icon"
      :class="['text-zinc-500', label && 'md:mr-2']"
      size="sm"
    />
    <span v-if="label" class="hidden sm:block">{{ label }}</span>
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    label: {
      type: String as PropType<string>,
      default: undefined,
    },
    icon: {
      type: String as PropType<string>,
      default: undefined,
    },
  },
})
</script>
