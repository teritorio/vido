<template>
  <div class="flex flex-col items-start">
    <a
      :id="`MenuLink-${menuLink.id}`"
      :href="menuLink.link.href"
      target="_blank"
      class="flex items-center justify-between w-full px-5 py-3 rounded-lg outline-none focus:outline-none hover:bg-zinc-100"
      @click="onClick"
    >
      <div class="flex items-center space-x-4">
        <div class="relative">
          <TeritorioIconBadge
            :color-fill="menuLink.link.color_fill"
            :picto="menuLink.link.icon"
            :size="size"
          />
        </div>
        <div
          :class="[
            'text-xs',
            menuLink.link.display_mode === 'large' &&
              'sm:text-sm mx-4 text-left grow w-full',
          ]"
        >
          {{ menuLink.link.name.fr }}
        </div>
      </div>
      <font-awesome-icon
        :class="[
          'text-zinc-700',
          menuLink.link.display_mode === 'compact' &&
            'absolute top-4 right-4 z-10 rounded-md bg-white fill-current ring-2 border-2 border-white ring-white',
        ]"
        fixed-width
        icon="external-link-alt"
        size="sm"
      />
    </a>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { ApiMenuLink } from '~/lib/apiMenu'

export default Vue.extend({
  components: {
    TeritorioIconBadge,
  },
  props: {
    menuLink: {
      type: Object as PropType<ApiMenuLink>,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClick() {
      this.$tracking({
        type: 'external_link',
        url: this.menuLink.link.href,
        title: this.menuLink.link.name.fr,
      })

      this.$emit('click', this.menuLink.id)
    },
  },
})
</script>
