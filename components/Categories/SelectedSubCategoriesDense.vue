<template>
  <div
    v-if="selectedCategories.length > 0"
    class="flex flex-row p-2 flex-wrap bg-white shadow-md pointer-events-auto rounded-xl max-w-xl"
    style="min-width: 64px"
  >
    <div
      v-for="category in selectedCategories"
      :key="category.id"
      class="m-1 relative"
      :title="
        (category.menu_group || category.link || category.category).name.fr
      "
    >
      <TeritorioIconBadge
        :id="category.id"
        :color-fill="
          (category.menu_group || category.link || category.category).color_fill
        "
        :picto="
          (category.menu_group || category.link || category.category).icon
        "
        size="lg"
      />
      <button
        class="flex items-center justify-center text-white text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600"
        :title="$tc('headerMenu.hideCategory')"
        @click="() => unselectCategory(category.id)"
      >
        <font-awesome-icon icon="times" class="text-white" size="sm" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { Category } from '~/lib/apiMenu'

export default Vue.extend({
  components: {
    TeritorioIconBadge,
  },
  props: {
    categories: {
      type: Array as PropType<Category[]>,
      required: true,
    },
    isSubCategorySelected: {
      type: Function,
      required: true,
    },
  },
  computed: {
    selectedCategories() {
      return this.categories.filter((c) => this.isSubCategorySelected(c.id))
    },
  },
  methods: {
    unselectCategory(categoryId: Category['id']) {
      this.$emit('category-unselect', [categoryId])
    },
  },
})
</script>
