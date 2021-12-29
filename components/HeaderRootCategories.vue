<template>
  <div class="flex flex-col space-y-6">
    <transition name="non-highlighted" appear>
      <div
        v-if="!collapsed"
        class="grid items-start grid-cols-3 sm:grid-cols-4 gap-3"
      >
        <CategoryButton
          v-for="category in nonHighlightedCategories"
          :id="category.id"
          :key="category.id"
          :color="(category.menu_group || category.category).color"
          :label="(category.menu_group || category.category).name.fr"
          :picto="(category.menu_group || category.category).icon"
          :type="(category.menu_group || category.category).display_mode"
          :active-sub-categories="categoriesActivesubsCount[category.id] || 0"
          @click="onCategoryClick(category)"
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
    onCategoryClick(category: Category) {
      this.$tracking({
        type: 'category',
        categoryId: category.id,
        title: (category.menu_group || category.category).name.fr,
      })
      this.$emit('category-click', category.id)
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
