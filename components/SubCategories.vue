<template>
  <div>
    <div>
      <h3
        class="sticky top-0 flex flex-row items-center py-4 font-bold uppercase bg-white"
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
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {},
})
</script>
