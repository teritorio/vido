<template>
  <div class="flex flex-col space-y-4" @keyup.esc="onEscape">
    <div class="grid items-start grid-cols-4 gap-1">
      <CategoryButton
        v-for="category in highlightedFirstLevelClasses"
        :key="category.id"
        :color="category.metadata.color"
        :label="category.metadata.label.fr"
        @click.native="onCategoryButtonClick(category.id)"
      >
        <component
          :is="pictoComponent(category.metadata.picto)"
          class="w-6 h-6 lg:w-7 lg:h-7"
        />
      </CategoryButton>
    </div>

    <button
      class="flex items-center justify-start gap-3 px-3 py-2 font-medium text-gray-800 rounded-full focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
      @click="onCollapseButtonClick"
    >
      <font-awesome-icon icon="chevron-down" />
      <span>Plus de choix</span>
    </button>

    <transition name="non-highlighted" appear>
      <div v-if="!collapsed" class="grid items-start grid-cols-4 gap-1">
        <CategoryButton
          v-for="category in nonHighlightedFirstLevelClasses"
          :key="category.id"
          :color="category.metadata.color"
          :label="category.metadata.label.fr"
          @click.native="onCategoryButtonClick(category.id)"
        >
          <component
            :is="pictoComponent(category.metadata.picto)"
            class="w-6 h-6 lg:w-7 lg:h-7"
          />
        </CategoryButton>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

import CategoryButton from '@/components/CategoryButton/CategoryButton.vue'

export default Vue.extend({
  components: {
    CategoryButton,
  },
  data(): {
    collapsed: boolean
  } {
    return {
      collapsed: true,
    }
  },
  computed: {
    ...mapGetters({
      highlightedFirstLevelClasses: 'config/highlightedFirstLevelClasses',
      nonHighlightedFirstLevelClasses: 'config/nonHighlightedFirstLevelClasses',
    }),
  },
  methods: {
    pictoComponent(pictoName: string) {
      if (pictoName) {
        return require(`@/assets/icons/${pictoName}•.svg?inline`)
      }

      return require(`@/assets/icons/services•.svg?inline`)
    },
    // onCategoryButtonClick(id: string) {
    //   this.selected = id
    // },
    onCollapseButtonClick() {
      this.collapsed = !this.collapsed
    },
    onCategoryButtonClick() {},
    onEscape() {
      // this.selected = null
    },
  },
})
</script>

<style>
.non-highlighted-enter-active {
  transition: opacity 0.1s, transform 0.1s;
}

.non-highlighted-enter {
  opacity: 0.4;
  transform: translateY(-3px);
}

.non-highlighted-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
