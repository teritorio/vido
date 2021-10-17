<template>
  <section v-if="entries.length + $i18n.locales.length > 0">
    <button
      :aria-label="$tc('navMenu.label')"
      type="button"
      class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
      @click="$refs.menuModal.show()"
    >
      <font-awesome-icon icon="bars" class="text-gray-800" size="sm" />
    </button>
    <TModal
      ref="menuModal"
      :hide-close-button="true"
      :classes="{
        overlay: 'z-40 bg-black bg-opacity-50',
        wrapper: 'z-50 mt-3 mr-3 max-w-max',
        modal: 'bg-white shadow rounded max-w-max ml-auto self-end',
        body: 'p-3',
        overlayEnterClass: 'opacity-0',
        overlayEnterActiveClass: 'transition ease-out duration-100',
        overlayEnterToClass: 'opacity-100',
        overlayLeaveClass: 'opacity-100',
        overlayLeaveActiveClass: 'transition ease-in duration-75',
        overlayLeaveToClass: 'opacity-0',
      }"
    >
      <div class="flex flex-col items-end">
        <button
          type="button"
          class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
          @click="$refs.menuModal.hide()"
        >
          <font-awesome-icon icon="times" class="text-gray-800" size="xs" />
        </button>

        <a
          v-for="entry in entries"
          :key="entry.post_id"
          class="w-full px-5 py-3 rounded-lg outline-none focus:outline-none hover:bg-gray-100"
          :href="entry.url"
          rel="noopener noreferrer"
          target="_blank"
          @click.stop
        >
          {{ entry.title }}
        </a>

        <a
          v-for="locale in $i18n.locales"
          :key="locale.code"
          class="w-full px-5 py-3 rounded-lg outline-none focus:outline-none hover:bg-gray-100"
          @click="$i18n.setLocale(locale.code)"
        >
          <font-awesome-icon
            v-if="locale.code === $i18n.locale"
            icon="times"
            class="text-gray-800"
            size="xs"
          />
          {{ locale.name }}
        </a>
      </div>
    </TModal>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { TModal } from 'vue-tailwind/dist/components'

import { NavMenuEntry } from '@/utils/types'

export default Vue.extend({
  components: {
    TModal,
  },

  data(): {
    entries: NavMenuEntry[]
  } {
    return {
      entries: [],
    }
  },

  mounted() {
    this.fetchConfig()
  },

  methods: {
    fetchConfig() {
      fetch(`${this.$config.API_ENDPOINT}/geodata/v1/articles?slug=non-classe`)
        .then((data) => data.json())
        .then((data) => (this.entries = data))
    },
  },
})
</script>
