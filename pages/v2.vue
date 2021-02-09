<template>
  <div class="w-full h-full overflow-hidden">
    <Map class="absolute w-full h-full" />

    <div class="fixed top-0 bottom-0 w-full p-4">
      <div class="grid grid-cols-2 gap-4 m-h-full lg:grid-cols-3">
        <div class="col-start-1 col-end-2 bg-white rounded-lg shadow-md">
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

        <div class="h-full row-start-2 space-y-4">
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
                  badge="6"
                  selected
                >
                  <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
                </category-button>
                <category-button name="Loisir" color="indigo">
                  <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
                </category-button>
                <category-button name="Promenade" color="purple" badge="2">
                  <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
                </category-button>
                <category-button name="Pratique" color="pink">
                  <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
                </category-button>
                <category-button name="Transport" color="yellow" badge="1">
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

          <map-poi-toast />
          <!-- Selections -->
          <!-- <div class="flex flex-col space-y-2">
            <div class="px-5 py-3 bg-white rounded-lg shadow-md">
              <h2 class="mb-2 text-xs font-bold text-gray-800 uppercase">
                Votre selection
              </h2>
              <div class="grid grid-cols-5 gap-2">
                <category-button name="Santé" color="red">
                  <LeisureParkGardenIcon class="w-6 h-6 fill-current" />
                </category-button>
              </div>
            </div>
          </div> -->
        </div>

        <div
          class="row-start-2 gap-2 px-5 overflow-y-auto bg-white rounded-lg shadow-md"
        >
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
                  <input type="radio" checked />
                  <span>Hotel</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="radio" />
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
                  <input type="radio" />
                  <span>Location</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="radio" checked />
                  <span>Village vacances</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="radio" checked />
                  <span>Résidence de tourisme</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="radio" checked />
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
                  <input type="radio" checked />
                  <span>Campings</span>
                </label>
              </li>
              <li>
                <label className="flex flex-row items-center space-x-2">
                  <input type="radio" checked />
                  <span>Aires de camping car</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- <div class="absolute flex justify-center w-full top-4">
      <div
        class="flex items-center max-w-xl px-5 py-3 space-x-5 bg-white rounded-lg shadow-md"
      >
        <h1>
          <Logo class="w-20 h-auto" />
        </h1>

        <form class="flex space-x-3">
          <input
            class="flex-1 w-full px-5 py-1 text-gray-700 placeholder-gray-800 bg-gray-100 border border-transparent rounded-full appearance-none text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Recherche..."
          />
        </form>
      </div>
    </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import LeisureParkGardenIcon from '@/assets/leisure-park-garden•.svg?inline'
// import ClosedMention from '@/components/ClosedMention.vue'
import CategoryButton from '@/components/CategoryButton.vue'
import Logo from '@/components/Logo.vue'
import Map from '@/components/Map.vue'

import MapPoiToast from '~/components/MapPoiToast.vue'
// import OpenMention from '@/components/OpenMention.vue'

export default Vue.extend({
  components: {
    // ClosedMention,
    LeisureParkGardenIcon,
    Logo,
    Map,
    CategoryButton,
    MapPoiToast,
    // OpenMention,
  },
})
</script>
