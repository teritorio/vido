<template>
  <ul>
    <li>
      <button
        v-if="title && href"
        aria-label="Partager sur Facebook"
        type="button"
        class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
      >
        <!-- href="https://www.facebook.com/share.php?u=https%3A%2F%2Fcarte.bidarttourisme.com%2Fcontent%2Fwp_poi%2Ftoki-toki%2F%3Fsite%3Dteritorio" -->
        <font-awesome-icon
          :icon="['fab', 'facebook']"
          :style="{ color: color }"
        />
      </button>
    </li>
    <li>
      <button
        v-if="title && href"
        aria-label="Partager sur Twitter"
        type="button"
        class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
      >
        <!-- href="https://twitter.com/intent/tweet?text=La+m%C3%A9diath%C3%A8que+Toki-Toki&amp;url=https%3A%2F%2Fcarte.bidarttourisme.com%2Fcontent%2Fwp_poi%2Ftoki-toki%2F%3Fsite%3Dteritorio&amp;via=carte.bidarttourisme.com" -->
        <font-awesome-icon
          :icon="['fab', 'twitter']"
          :style="{ color: color }"
        />
      </button>
    </li>
    <li>
      <button
        v-if="title && href"
        aria-label="Partager sur WhatsApp"
        type="button"
        class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
      >
        <!-- href="https://api.whatsapp.com/send?text=La+m%C3%A9diath%C3%A8que+Toki-Toki https%3A%2F%2Fcarte.bidarttourisme.com%2Fcontent%2Fwp_poi%2Ftoki-toki%2F%3Fsite%3Dteritorio" -->
        <font-awesome-icon
          :icon="['fab', 'whatsapp']"
          :style="{ color: color }"
        />
      </button>
    </li>
    <li>
      <button
        aria-label="Imprimer"
        type="button"
        class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
      >
        <font-awesome-icon icon="print" :style="{ color: color }" />
      </button>
    </li>
    <li>
      <button
        v-if="href"
        aria-label="Copier le lien"
        type="button"
        class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
      >
        <font-awesome-icon icon="link" :style="{ color: color }" />
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: null,
    },
    href: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/details.scss';

ul {
  position: relative;
  display: block;
  width: 100%;
  text-align: right;
  margin-bottom: 0.6rem;
  list-style: none;

  li {
    display: inline-block;
    margin: 0.3rem;
    border-radius: 50%;
  }
}
</style>
