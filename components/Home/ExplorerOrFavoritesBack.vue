<template>
  <MenuBlock extra-class-text-background="bg-blue-500 text-white">
    <div class="flex items-center ml-2">
      <button
        type="button"
        class="flex shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
        @click="goToMenuItems"
      >
        <font-awesome-icon icon="arrow-left" size="xs" />
      </button>
      <p class="ml-2">
        {{
          $tc(
            isModeFavorites
              ? 'headerMenu.backToMenuFavorites'
              : 'headerMenu.backToMenuExplorer'
          )
        }}
      </p>
    </div>
  </MenuBlock>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

import MenuBlock from '~/components/Home/MenuBlock.vue'

export default Vue.extend({
  components: {
    MenuBlock,
  },

  computed: {
    ...mapGetters({
      isModeFavorites: 'map/isModeFavorites',
    }),
  },

  methods: {
    goToMenuItems() {
      this.$emit('click')
    },
  },
})
</script>
