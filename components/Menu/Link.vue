<template>
  <MenuItem
    :id="`MenuLink-${menuLink.id}`"
    :href="menuLink.link.href"
    :display-mode="menuLink.link.display_mode || displayModeDefault"
    :color-fill="menuLink.link.color_fill"
    :icon="menuLink.link.icon"
    :size="size"
    :name="menuLink.link.name"
    :badge-class="
      [
        'bg-white text-zinc-700 rounded-full border-2 border-white',
        size === '2xl' ? 'w-6 h-6' : 'w-5 h-5',
      ].join(' ')
    "
    @click="onClick"
  >
    <template v-if="menuLink.link.display_mode === 'compact'" #badge>
      <font-awesome-icon icon="external-link-alt" size="sm" />
    </template>
    <template #end-line-large>
      <font-awesome-icon icon="external-link-alt" />
    </template>
  </MenuItem>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import MenuItem from '~/components/Menu/Item.vue'
import { ApiMenuLink } from '~/lib/apiMenu'

export default defineComponent({
  components: {
    MenuItem,
  },
  props: {
    menuLink: {
      type: Object as PropType<ApiMenuLink>,
      required: true,
    },
    size: {
      type: String as PropType<string>,
      required: true,
    },
    displayModeDefault: {
      type: String as PropType<string>,
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
