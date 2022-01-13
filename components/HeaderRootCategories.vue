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
          :active-sub-categories="getCategoryCount(category.id)"
          @click="onCategoryClick(category)"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import CategoryButton from '@/components/CategoryButton/CategoryButton.vue'
import { Category } from '@/utils/types'

export default Vue.extend({
  components: {
    CategoryButton,
  },
  props: {
    categoryId: {
      type: Number,
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
  computed: {
    ...mapGetters({
      getHighlightedRootCategoriesFromCategoryId:
        'menu/getHighlightedRootCategoriesFromCategoryId',
      getNonHighlightedRootCategoriesFromCategoryId:
        'menu/getNonHighlightedRootCategoriesFromCategoryId',
    }),
    nonHighlightedCategories(): Category[] {
      return this.getNonHighlightedRootCategoriesFromCategoryId(this.categoryId)
    },
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
    getCategoryCount(id: Category['id']) {
      return this.categoriesActivesubsCount[id] || 0
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
