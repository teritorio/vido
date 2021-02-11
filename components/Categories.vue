<template>
  <div class="flex flex-col space-y-4 overflow-hidden" @keyup.esc="onEscape">
    <div class="p-4 bg-white rounded-lg shadow-md">
      <h2 class="mb-4 text-xs font-bold text-gray-800 uppercase">
        Les catégories
      </h2>
      <div class="grid grid-cols-4 gap-1 md:grid-cols-5">
        <category-button
          v-for="(category, name) in categories"
          :key="name"
          :name="category.label"
          :badge="category.badge"
          :color="category.color"
          :selected="selected === name"
          @click.native="onCategoryButtonClick(name)"
        >
          <component :is="category.icon" class="w-6 h-6" />
        </category-button>
      </div>
    </div>

    <sub-categories
      v-if="selected"
      class="px-5 overflow-y-auto bg-white rounded-lg shadow-md"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import LeisureParkGardenIcon from '@/assets/leisure-park-garden•.svg?inline'
import CategoryButton from '@/components/CategoryButton.vue'
import SubCategories from '@/components/SubCategories.vue'

export default Vue.extend({
  components: {
    CategoryButton,
    LeisureParkGardenIcon,
    SubCategories,
  },
  data(): {
    selected: null | string
    categories: Record<
      string,
      {
        label: string
        color: string
        badge: number
        icon: any
      }
    >
  } {
    return {
      selected: null,
      categories: {
        bar: {
          label: 'Bars',
          color: 'blue',
          badge: 0,
          icon: LeisureParkGardenIcon,
        },
        housing: {
          label: 'Hébergement',
          color: 'green',
          badge: 6,
          icon: LeisureParkGardenIcon,
        },
        hobby: {
          label: 'Loisir',
          color: 'indigo',
          badge: 0,
          icon: LeisureParkGardenIcon,
        },
        walk: {
          label: 'Promenade',
          color: 'blue',
          badge: 2,
          icon: LeisureParkGardenIcon,
        },
        utils: {
          label: 'Pratique',
          color: 'purple',
          badge: 0,
          icon: LeisureParkGardenIcon,
        },
        transport: {
          label: 'Transport',
          color: 'pink',
          badge: 1,
          icon: LeisureParkGardenIcon,
        },
        food: {
          label: 'Alimentation',
          color: 'yellow',
          badge: 0,
          icon: LeisureParkGardenIcon,
        },
        shoping: {
          label: 'Commerce',
          color: 'green',
          badge: 0,
          icon: LeisureParkGardenIcon,
        },
        health: {
          label: 'Santé',
          color: 'red',
          badge: 0,
          icon: LeisureParkGardenIcon,
        },
      },
    }
  },
  methods: {
    onCategoryButtonClick(name: string) {
      this.selected = name
    },
    onEscape() {
      this.selected = null
    },
  },
})
</script>
