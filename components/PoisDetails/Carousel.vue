<template>
  <div v-if="images.length == 1" class="margin">
    <NuxtPicture :src="images[0]" />
  </div>
  <VueAgile
    v-else-if="images.length > 1"
    id="agile"
    class="margin"
    :dots="dots"
    :nav-buttons="false"
  >
    <div v-for="(image, i) in images" :key="i" class="slide">
      <NuxtPicture :key="i" :src="image" media-size="66vw" />
    </div>
  </VueAgile>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import VueAgile from 'vue-agile/src/Agile.vue'

import NuxtPicture from '~/components/UI/NuxtPicture.vue'

export default Vue.extend({
  components: {
    VueAgile,
    NuxtPicture,
  },

  props: {
    images: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  data(): {
    dots: boolean
  } {
    return {
      dots: false,
    }
  },

  mounted() {
    // Workarround SSR issue.
    // https://github.com/lukaszflorczak/vue-agile/issues/163
    this.dots = true
  },
})
</script>

<style lang="css" scoped>
.margin {
  margin-bottom: 60px;
}
</style>

<style lang="css">
#agile ul.agile__dots {
  @apply list-none;

  bottom: 15px;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  margin: 0;
  padding: 0;
}

.agile__dot {
  margin: 0 5px;
}

.agile__dot button {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  display: block;
  height: 15px;
  font-size: 0;
  line-height: 0;
  margin: 0;
  padding: 0;
  transition-duration: 0.3s;
  width: 15px;
}

.agile__dot--current button,
.agile__dot:hover button {
  background-color: #fff;
}

.slide {
  display: block;
  height: 500px;
  -o-object-fit: cover;
  object-fit: cover;
  width: 100%;
}
</style>
