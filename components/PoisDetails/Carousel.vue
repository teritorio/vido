<template>
  <div v-if="images.length == 1" class="margin">
    <nuxt-picture :src="images[0]" />
  </div>
  <agile
    v-else-if="images.length > 1"
    class="margin"
    :dot="true"
    :nav-buttons="false"
  >
    <div v-for="(image, i) in images" :key="i" class="slide">
      <nuxt-picture :key="i" :src="image" />
    </div>
  </agile>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import VueAgile from 'vue-agile/src/Agile.vue'

export default Vue.extend({
  components: {
    agile: VueAgile,
  },

  props: {
    images: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
})
</script>

<style lang="css" scoped>
.margin {
  margin-bottom: 60px;
}
</style>
