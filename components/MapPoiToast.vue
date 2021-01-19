<template>
  <div
    class="max-w-xl mx-auto flex bg-white rounded-xl shadow-md overflow-hidden"
  >
    <img
      class="h-full w-48 object-cover"
      src="https://images.unsplash.com/photo-1591242825378-ba17ddd7975c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80"
      alt="Lorem Ipsum dolor sit amet"
    />

    <div class="p-8">
      <div class="flex justify-between">
        <div
          class="uppercase tracking-wide text-sm text-blue-500 font-semibold"
        >
          Restaurant
        </div>

        <OpenMention />
      </div>

      <p
        class="block mt-2 text-lg leading-tight font-medium text-black hover:underline"
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
