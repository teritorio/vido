<template>
  <div class="flex flex-col space-y-6">
    <!-- <div class="grid items-start grid-cols-4 gap-3">
      <CategoryButton
        v-for="category in highlightedCategories"
        :id="category.id"
        :key="category.id"
        :color="category.metadata.color"
        :label="category.metadata.label.fr"
        :picto="category.metadata.picto"
        @click="onCategoryClick"
      />
    </div>

    <button
      class="flex items-center justify-start gap-3 px-3 py-2 font-medium text-gray-800 rounded-md outline-none focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
      @click="onCollapseButtonClick"
    >
      <font-awesome-icon icon="chevron-down" />
      <span>Plus de choix</span>
    </button> -->

    <transition name="non-highlighted" appear>
      <div v-if="!collapsed" class="grid items-start grid-cols-4 gap-3">
        <CategoryButton
          v-for="category in nonHighlightedCategories"
          :id="category.id"
          :key="category.id"
          :color="category.metadata.color"
          :label="category.metadata.label.fr"
          :picto="category.metadata.picto"
          :active-sub-categories="categoriesActivesubsCount[category.id] || 0"
          @click="onCategoryClick"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import CategoryButton from '@/components/CategoryButton/CategoryButton.vue'
import { Category } from '@/utils/types'

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
    categoriesActivesubsCount: {
      type: Object as PropType<{ [id: string]: number }>,
      default: {},
    },
  },
  data(): {
    collapsed: boolean
  } {
    return {
      collapsed: false,
    }
  },
  methods: {
    onCollapseButtonClick() {
      this.collapsed = !this.collapsed
    },
    onCategoryClick(categoryId: Category['id']) {
      this.$emit('category-click', categoryId)
    },
  },
})
</script>

<style>
/* .non-highlighted-enter-active {
  transition: opacity 0.1s, transform 0.1s;
}

.non-highlighted-enter {
  opacity: 0.4;
  transform: translateY(-3px);
}

.non-highlighted-enter-to {
  opacity: 1;
  transform: translateY(0);
} */
</style>
