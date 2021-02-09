<template>
  <div
    class="flex max-w-xl mx-auto overflow-hidden bg-white shadow-md rounded-xl"
  >
    <img
      class="object-cover w-48"
      src="https://images.unsplash.com/photo-1591242825378-ba17ddd7975c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80"
      alt="Lorem Ipsum dolor sit amet"
    />

    <div class="p-8">
      <div class="flex justify-between">
        <div
          class="text-sm font-semibold tracking-wide text-blue-500 uppercase"
        >
          Restaurant
        </div>

        <OpenMention />
      </div>

      <p
        class="block mt-2 text-lg font-medium leading-tight text-black hover:underline"
      >
        Lorem Ipsum dolor sit amet
      </p>

      <p class="mt-2 text-gray-500">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import OpenMention from '@/components/OpenMention.vue'

export default Vue.extend({
  components: {
    OpenMention,
  },
})
</script>
