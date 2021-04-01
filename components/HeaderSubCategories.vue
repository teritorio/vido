<template>
  <div class="flex flex-col space-y-4">
    <div class="grid items-start grid-cols-3 gap-2">
      <CategoryButton
        v-for="category in categories"
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
    categories: {
      type: Array,
      required: true,
    },
    onCategoryClick: {
      type: Function,
      required: true,
    },
  },
  methods: {
    pictoComponent(pictoName: string) {
      if (pictoName) {
        return require(`@/assets/icons/${pictoName}•.svg?inline`)
      }

      return require(`@/assets/icons/services•.svg?inline`)
    },
    onCategoryButtonClick(categoryId: string) {
      this.onCategoryClick(categoryId)
    },
  },
})
</script>
