<template>
  <div class="flex flex-col space-y-4">
    <div
      class="grid items-start grid-flow-col gap-1 sm:grid-cols-4 auto-cols-fr"
    >
      <CategoryButton
        v-for="category in highlightedCategories"
        :key="category.id"
        :color="category.metadata.color"
        :label="category.metadata.label.fr"
        @click.native="onCategoryButtonClick(category.id)"
      >
        <component
          :is="pictoComponent(category.metadata.picto)"
          class="w-7 h-7"
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
      <div
        v-if="!collapsed"
        class="grid items-start grid-flow-col gap-1 sm:grid-cols-4 auto-cols-fr"
      >
        <CategoryButton
          v-for="category in nonHighlightedCategories"
          :key="category.id"
          :color="category.metadata.color"
          :label="category.metadata.label.fr"
          @click.native="onCategoryButtonClick(category.id)"
        >
          <component
            :is="pictoComponent(category.metadata.picto)"
            class="w-7 h-7"
          />
        </CategoryButton>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import CategoryButton from '@/components/CategoryButton/CategoryButton.vue'

export default Vue.extend({
  components: {
    CategoryButton,
  },
  props: {
    highlightedCategories: {
      type: Array,
      required: true,
    },
    nonHighlightedCategories: {
      type: Array,
      required: true,
    },
    onCategoryClick: {
      type: Function,
      required: true,
    },
  },
  data(): {
    collapsed: boolean
  } {
    return {
      collapsed: true,
    }
  },
  methods: {
    pictoComponent(pictoName: string) {
      if (pictoName) {
        return require(`@/assets/icons/${pictoName}•.svg?inline`)
      }

      return require(`@/assets/icons/services•.svg?inline`)
    },
    onCollapseButtonClick() {
      this.collapsed = !this.collapsed
    },
    onCategoryButtonClick(categoryId: string) {
      this.onCategoryClick(categoryId)
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
