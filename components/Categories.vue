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

import CateringIcon from '@/assets/icons/catering•.svg?inline'
import ConvenienceIcon from '@/assets/icons/convenience•.svg?inline'
import HostingIcon from '@/assets/icons/hosting•.svg?inline'
import WalkIcon from '@/assets/icons/leisure-park-garden•.svg?inline'
import LeisureIcon from '@/assets/icons/leisure•.svg?inline'
import MobilityIcon from '@/assets/icons/mobility•.svg?inline'
import SafetyIcon from '@/assets/icons/safety•.svg?inline'
import ServicesIcon from '@/assets/icons/services•.svg?inline'
import ShoppingIcon from '@/assets/icons/shopping•.svg?inline'
import CategoryButton from '@/components/CategoryButton.vue'
import SubCategories from '@/components/SubCategories.vue'

export default Vue.extend({
  components: {
    CateringIcon,
    ConvenienceIcon,
    HostingIcon,
    WalkIcon,
    LeisureIcon,
    MobilityIcon,
    SafetyIcon,
    ServicesIcon,
    ShoppingIcon,
    CategoryButton,
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
        catering: {
          label: 'Bars',
          color: 'yellow',
          badge: 0,
          icon: CateringIcon,
        },
        hosting: {
          label: 'Hébergement',
          color: 'blue',
          badge: 6,
          icon: HostingIcon,
        },
        leisure: {
          label: 'Loisir',
          color: 'indigo',
          badge: 0,
          icon: LeisureIcon,
        },
        walk: {
          label: 'Promenade',
          color: 'green',
          badge: 2,
          icon: WalkIcon,
        },
        services: {
          label: 'Pratique',
          color: 'purple',
          badge: 0,
          icon: ServicesIcon,
        },
        mobility: {
          label: 'Transport',
          color: 'pink',
          badge: 1,
          icon: MobilityIcon,
        },
        convenience: {
          label: 'Alimentation',
          color: 'yellow',
          badge: 0,
          icon: ConvenienceIcon,
        },
        shopping: {
          label: 'Commerce',
          color: 'green',
          badge: 0,
          icon: ShoppingIcon,
        },
        safety: {
          label: 'Santé',
          color: 'red',
          badge: 0,
          icon: SafetyIcon,
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
