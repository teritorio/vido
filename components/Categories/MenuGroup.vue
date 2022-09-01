<template>
  <a
    :id="`MenuGroup-${menuGroup.id}`"
    :href="href || `/${menuGroup.id}`"
    target="_blank"
    :class="[
      'flex focus:outline-none outline-none items-center text-center self-stretch justify-start leading-none transition-colors rounded-lg p-4 relative hover:bg-zinc-100',
      menuGroup.menu_group.display_mode === 'large'
        ? 'col-span-4 pt-2 pb-0'
        : 'pt-4 pb-2 flex-col',
    ]"
    @click.prevent="onClick"
  >
    <div
      class="relative flex items-center justify-center w-12 h-12 mb-2 text-white rounded-full"
      :style="{ flexShrink: 0 }"
    >
      <TeritorioIconBadge
        :color-fill="menuGroup.menu_group.color_fill"
        :picto="menuGroup.menu_group.icon"
        :size="size"
      >
        <div
          v-if="activeSubCategories > 0"
          class="text-white text-xs font-semibold font-sans text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600"
        >
          {{ activeSubCategories }}
        </div>
      </TeritorioIconBadge>
    </div>

    <div
      :class="[
        'text-xs',
        menuGroup.menu_group.display_mode === 'large' &&
          'sm:text-sm mx-4 text-left grow w-full',
      ]"
    >
      {{ menuGroup.menu_group.name.fr }}
    </div>
    <font-awesome-icon
      v-if="menuGroup.menu_group.display_mode === 'large'"
      icon="chevron-right"
      class="text-zinc-700 shrink-0"
      size="sm"
    />
  </a>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { ApiMenuGroup } from '~/lib/apiMenu'

export default Vue.extend({
  components: {
    TeritorioIconBadge,
  },
  props: {
    menuGroup: {
      type: Object as PropType<ApiMenuGroup>,
      required: true,
    },
    activeSubCategories: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClick(event: Event) {
      this.$tracking({
        type: 'menu',
        menuItemId: this.menuGroup.id,
        title: this.menuGroup.menu_group.name.fr,
      })

      this.$emit('click', this.menuGroup.id)
    },
  },
})
</script>
