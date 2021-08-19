<template>
  <div
    v-if="selectedCategories.length > 0"
    class="flex flex-row p-2 flex-wrap bg-white shadow-md pointer-events-auto rounded-xl"
  >
    <div
      v-for="category in selectedCategories"
      :key="category.id"
      class="m-1 relative"
      :title="category.metadata.label.fr"
    >
      <TeritorioIconBadge
        :id="category.id"
        :color="category.metadata.color"
        :picto="category.metadata.picto"
        size="lg"
      />
      <button
        class="flex items-center justify-center text-white text-center rounded-full absolute -top-1 -right-1 w-5 h-5 border-2 border-white bg-red-600"
        title="Masquer cette catégorie"
        @click="() => unselectCategory(category.id)"
      >
        <font-awesome-icon icon="times" class="text-white" size="sm" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '@/components/TeritorioIcon/TeritorioIconBadge.vue'
import { Category } from '@/utils/types'

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
