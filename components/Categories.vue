<template>
  <div class="px-5 py-4 bg-white rounded-lg shadow-md">
    <h2 class="mb-4 text-xs font-bold text-gray-800 uppercase">
      Les catégories
    </h2>

    <div class="grid grid-cols-5 gap-y-4 gap-x-2">
      <category-button name="Bar" color="blue">
        <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
      </category-button>
      <category-button name="Hébergement" color="green" :badge="6" selected>
        <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
      </category-button>
      <category-button name="Loisir" color="indigo">
        <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
      </category-button>
      <category-button name="Promenade" color="purple" :badge="2">
        <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
      </category-button>
      <category-button name="Pratique" color="pink">
        <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
      </category-button>
      <category-button name="Transport" color="yellow" :badge="1">
        <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
      </category-button>
      <category-button name="Alimentation" color="blue">
        <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
      </category-button>
      <category-button name="Commerce" color="green">
        <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
      </category-button>
      <category-button name="Santé" color="red">
        <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
      </category-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import LeisureParkGardenIcon from '@/assets/leisure-park-garden•.svg?inline'
import CategoryButton from '@/components/CategoryButton.vue'

export default Vue.extend({
  components: {
    CategoryButton,
    LeisureParkGardenIcon,
  },
})
</script>
