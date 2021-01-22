<template>
  <div class="flex">
    <div class="w-1/2 px-16 py-8">
      <h1 class="uppercase font-bold">Titre</h1>

      <form class="flex w-full max-w-xl mx-auto my-4 space-x-3">
        <input
          class="flex-1 appearance-none border border-transparent w-full py-2 px-4 bg-gray-100 text-gray-700 placeholder-gray-800 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Une petite faim ?"
        />
        <button
          class="flex-shrink-0 bg-blue-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
        >
          Chercher
        </button>
      </form>

      <div class="mt-10">
        <div class="inline-block w-80 m-6 overflow-hidden">
          <a href="#">
            <img
              class="h-48 w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1591242825378-ba17ddd7975c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80"
              alt="Lorem Ipsum dolor sit amet"
            />
          </a>

          <div class="mt-6 flex justify-between">
            <div
              class="uppercase tracking-wide text-sm text-blue-500 font-semibold"
            >
              Restaurant
            </div>

            <OpenMention />
          </div>

          <a
            href="#"
            class="block mt-2 text-lg leading-tight font-medium text-black hover:underline"
          >
            Lorem Ipsum dolor sit amet
          </a>
        </div>

        <div class="inline-block w-80 m-6 overflow-hidden">
          <a href="#">
            <img
              class="h-48 w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1600767421554-069608adb34d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="At vero eos et accusamus"
            />
          </a>

          <div class="mt-6 flex justify-between">
            <div
              class="uppercase tracking-wide text-sm text-blue-500 font-semibold"
            >
              Hôtel
            </div>

            <ClosedMention />
          </div>

          <a
            href="#"
            class="block mt-2 text-lg leading-tight font-medium text-black hover:underline"
          >
            At vero eos et accusamus
          </a>
        </div>

        <div class="inline-block w-80 m-6 overflow-hidden">
          <a href="#">
            <img
              class="h-48 w-full object-cover rounded-xl"
              src="https://images.unsplash.com/photo-1599693095894-f5e044a0386d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80"
              alt="Nemo enim ipsam voluptatem"
            />
          </a>

          <div class="mt-6 flex justify-between">
            <div
              class="uppercase tracking-wide text-sm text-blue-500 font-semibold"
            >
              Lieu
            </div>
          </div>

          <a
            href="#"
            class="block mt-2 text-lg leading-tight font-medium text-black hover:underline"
          >
            Nemo enim ipsam voluptatem
          </a>
        </div>

        <div class="inline-block w-80 m-6 overflow-hidden">
          <a
            href="#"
            class="h-48 w-full flex justify-center items-center bg-green-100 rounded-xl"
          >
            <LeisureParkGardenIcon
              class="w-12 h-12 fill-current text-green-300"
            />
          </a>

          <div class="mt-6 flex justify-between">
            <div
              class="uppercase tracking-wide text-sm text-blue-500 font-semibold"
            >
              Lieu
            </div>
          </div>

          <a
            href="#"
            class="block mt-2 text-lg leading-tight font-medium text-black hover:underline"
          >
            Ut enim ad minima veniam
          </a>
        </div>
      </div>
    </div>

    <div class="fixed inset-y-0 right-0 w-1/2 h-full p-16">
      <Map class="h-full" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Map from '@/components/Map.vue'
import OpenMention from '@/components/OpenMention.vue'
import ClosedMention from '@/components/ClosedMention.vue'
import LeisureParkGardenIcon from '@/assets/leisure-park-garden•.svg?inline'

export default Vue.extend({
  components: {
    ClosedMention,
    LeisureParkGardenIcon,
    Map,
    OpenMention,
  },
})
</script>

<style>
svg.fill-current g {
  fill: currentColor;
}
</style>
