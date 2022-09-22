<template>
  <div class="flex flex-col items-start">
    <a
      :id="`MenuItem-${id}`"
      :href="href"
      target="_blank"
      :class="[
        'flex focus:outline-none outline-none items-center text-center self-stretch justify-start leading-none transition-colors rounded-lg relative hover:bg-zinc-100',
        displayMode === 'large'
          ? 'px-4 py-2 col-start-1 col-span-4'
          : 'p-4 flex-col',
      ]"
      @click="$emit('click', $event)"
    >
      <div
        :class="[
          'relative flex items-center justify-center w-12 h-12 text-white rounded-full',
          displayMode === 'compact' && 'mb-2',
        ]"
        :style="{ flexShrink: 0 }"
      >
        <TeritorioIconBadge :color-fill="colorFill" :picto="icon" :size="size">
          <div
            v-if="$slots.badge"
            :class="
              'text-zinc-700 text-xs font-semibold font-sans text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-white ' +
              badgeClass
            "
          >
            <slot name="badge" />
          </div>
        </TeritorioIconBadge>
      </div>

      <div
        :class="[
          displayMode === 'compact' && 'text-xs',
          displayMode === 'large' && 'mx-4 text-left grow w-full',
        ]"
      >
        {{ name.fr }}
      </div>

      <slot
        v-if="displayMode === 'large'"
        name="end-line-large"
        class="text-zinc-700 shrink-0"
        size="sm"
      />
    </a>

    <slot name="more" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { MenuItem } from '~/lib/apiMenu'
import { MultilingualString } from '~/utils/types'

export default Vue.extend({
  components: {
    TeritorioIconBadge,
  },
  props: {
    id: {
      type: Number as PropType<MenuItem['id']>,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    displayMode: {
      type: String,
      required: true,
    },
    colorFill: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    name: {
      type: Object as PropType<MultilingualString>,
      required: true,
    },
    badgeClass: {
      type: String,
      default: '',
    },
  },
})
</script>
