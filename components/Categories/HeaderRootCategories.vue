<template>
  <div class="flex flex-col space-y-6">
    <transition name="non-highlighted" appear>
      <div v-if="!collapsed" class="grid items-start grid-cols-4 gap-3">
        <CategoryButton
          v-for="category in nonHighlightedCategories"
          :key="category.id"
          :category-id="category.id"
          :color-fill="
            (category.menu_group || category.link || category.category)
              .color_fill
          "
          :label="
            (category.menu_group || category.link || category.category).name.fr
          "
          :picto="
            (category.menu_group || category.link || category.category).icon
          "
          :type="
            (category.menu_group || category.link || category.category)
              .display_mode
          "
          :href="category.link && category.link.href"
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

import CategoryButton from '@/components/Categories/CategoryButton/CategoryButton.vue'
import { Category } from '@/lib/apiMenu'

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
      required: true,
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
      getRootCategoriesFromCategoryId: 'menu/getRootCategoriesFromCategoryId',
    }),
    nonHighlightedCategories(): Category[] {
      return this.getRootCategoriesFromCategoryId(this.categoryId)
    },
  },
  methods: {
    onCollapseButtonClick() {
      this.collapsed = !this.collapsed
    },
    onCategoryClick(category: Category) {
      this.$emit('category-click', category.id)
    },
    getCategoryCount(id: Category['id']) {
      return this.categoriesActivesubsCount[id]
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
