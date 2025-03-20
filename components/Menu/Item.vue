<script lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import type { MultilingualString } from '~/utils/types'

export default defineNuxtComponent({
  components: {
    TeritorioIconBadge,
  },

  emits: {
    click: (_val: MouseEvent) => true,
  },

  props: {
    id: {
      type: String as PropType<string>,
      required: true,
    },
    href: {
      type: String as PropType<string>,
      required: true,
    },
    displayMode: {
      type: String as PropType<'compact' | 'large'>,
      required: true,
    },
    colorFill: {
      type: String as PropType<string>,
      required: true,
    },
    icon: {
      type: String as PropType<string>,
      required: true,
    },
    size: {
      type: String as PropType<FontAwesomeIconProps['size']>,
      required: true,
    },
    name: {
      type: Object as PropType<MultilingualString>,
      required: true,
    },
    badgeClass: {
      type: String as PropType<string>,
      default: '',
    },
  },
})
</script>

<template>
  <div class="tw-flex tw-flex-col tw-items-start">
    <NuxtLink
      :id="id"
      :to="{
        path: href,
        query: $route.query,
        hash: $route.hash,
      }"
      class="tw-flex focus:tw-outline-none tw-outline-none tw-items-center tw-text-center tw-self-stretch tw-justify-start tw-leading-none tw-transition-colors tw-rounded-lg tw-relative hover:tw-bg-zinc-100" :class="[
        displayMode === 'large'
          ? 'tw-px-4 tw-py-2 tw-col-start-1 tw-col-span-4'
          : 'tw-p-4 tw-flex-col',
      ]"
      @click="$emit('click', $event)"
    >
      <div
        class="tw-relative tw-flex tw-items-center tw-justify-center tw-w-12 tw-h-12 tw-text-white tw-rounded-full" :class="[
          displayMode === 'compact' && 'tw-mb-2',
        ]"
        :style="{ flexShrink: 0 }"
      >
        <TeritorioIconBadge :color-fill="colorFill" :picto="icon" :size="size">
          <span
            v-if="$slots.badge"
            class="tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-semibold tw-font-sans tw-text-center tw-absolute" :class="[
              size === '2xl'
                ? '-tw-top-3 -tw-right-3'
                : '-tw-top-1 -tw-right-1',
              badgeClass,
            ]"
          >
            <slot name="badge" />
          </span>
        </TeritorioIconBadge>
      </div>

      <div
        :class="[
          displayMode === 'compact' && 'tw-text-xs',
          displayMode === 'large' && 'tw-mx-4 tw-text-left tw-grow tw-w-full',
        ]"
      >
        {{ name.fr }}
      </div>

      <slot
        v-if="displayMode === 'large'"
        name="end-line-large"
        class="tw-text-zinc-700 tw-shrink-0"
        size="sm"
      />
    </NuxtLink>

    <slot name="more" />
  </div>
</template>
