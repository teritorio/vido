<template>
  <div class="w-full h-full overflow-hidden">
    <Map class="absolute w-full h-full" />

    <div class="fixed top-0 bottom-0 w-full p-4 pointer-events-none">
      <div
        class="flex flex-col w-full h-full space-y-4 pointer-events-auto md:w-1/2 xl:w-1/3"
      >
        <div class="flex-grow-0 flex-shrink-0 bg-white rounded-lg shadow-md">
          <div class="flex flex-row items-stretch">
            <h1 class="flex px-5 py-3">
              <Logo class="w-20 h-auto" />
            </h1>

            <form class="flex flex-1 overflow-hidden rounded-r-lg">
              <input
                class="flex w-full h-full px-5 font-medium text-gray-500 placeholder-gray-600 bg-gray-100 appearance-none hover:bg-white focus:bg-white text-md"
                placeholder="Rechercher dans les Landes"
              />
            </form>
          </div>
        </div>

        <div class="flex-grow-0 flex-shrink-0 space-y-4">
          <!-- Categories -->
          <div class="flex flex-col space-y-2">
            <div class="px-5 py-4 bg-white rounded-lg shadow-md">
              <h2 class="mb-4 text-xs font-bold text-gray-800 uppercase">
                Les catégories
              </h2>

              <div class="grid grid-cols-5 gap-y-4 gap-x-2">
                <category-button name="Bar" color="blue">
                  <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
                </category-button>
                <category-button
                  name="Hébergement"
                  color="green"
                  :badge="6"
                  selected
                >
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
          </div>
        </div>

        <div class="px-5 overflow-y-auto bg-white rounded-lg shadow-md">
          <div>
            <h3
              class="sticky top-0 flex flex-row items-center py-2 py-4 font-bold uppercase bg-white"
            >
              <span>Chambres</span>
              <span
                class="flex items-center justify-center w-6 h-6 ml-2 text-xs font-bold text-white bg-green-900 border-2 border-white rounded-full"
                >1</span
              >
            </h3>
            <ul class="mb-4">
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="checkbox" checked />
                  <span>Hotel</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="checkbox" />
                  <span>Chambre d'hôtes</span>
                </label>
              </li>
            </ul>
          </div>
          <div>
            <h3
              class="sticky top-0 flex flex-row items-center py-2 pt-4 font-bold uppercase bg-white"
            >
              <span>Locations</span>
              <span
                class="flex items-center justify-center w-6 h-6 ml-2 text-xs font-bold text-white bg-green-900 border-2 border-white rounded-full"
                >3</span
              >
            </h3>
            <ul class="mb-4">
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="checkbox" />
                  <span>Location</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="checkbox" checked />
                  <span>Village vacances</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="checkbox" checked />
                  <span>Résidence de tourisme</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="checkbox" checked />
                  <span>Agences immobilière</span>
                </label>
              </li>
            </ul>
          </div>
          <div>
            <h3
              class="sticky top-0 flex flex-row items-center py-2 pt-4 font-bold uppercase bg-white"
            >
              <span>Camping</span>
              <span
                class="flex items-center justify-center w-6 h-6 ml-2 text-xs font-bold text-white bg-green-900 border-2 border-white rounded-full"
                >2</span
              >
            </h3>
            <ul class="mb-4">
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="checkbox" checked />
                  <span>Campings</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="checkbox" checked />
                  <span>Aires de camping car</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import LeisureParkGardenIcon from '@/assets/leisure-park-garden•.svg?inline'
import CategoryButton from '@/components/CategoryButton.vue'
import Logo from '@/components/Logo.vue'
import Map from '@/components/Map.vue'

export default Vue.extend({
  components: {
    LeisureParkGardenIcon,
    Logo,
    Map,
    CategoryButton,
  },
})
</script>
