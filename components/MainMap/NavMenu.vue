<template>
  <section v-if="entries.length + $i18n.locales.length > 0">
    <TDropdown
      :classes="{
        dropdown:
          'origin-top-right absolute right-0 rounded shadow bg-white mt-1',
        dropdownWrapper: 'relative z-40',
      }"
    >
      <button
        slot="trigger"
        slot-scope="{
          mousedownHandler,
          focusHandler,
          blurHandler,
          keydownHandler,
          isShown,
        }"
        :aria-label="$tc('navMenu.label')"
        type="button"
        class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0"
        @mousedown="mousedownHandler"
        @focus="focusHandler"
        @blur="blurHandler"
        @keydown="keydownHandler"
      >
        <font-awesome-icon
          :icon="isShown ? 'times' : 'bars'"
          class="text-zinc-800"
          size="sm"
        />
      </button>

      <div class="py-1 rounded-md shadow-xs flex flex-col w-max">
        <a
          v-for="entry in entries"
          :key="entry.post_id"
          class="w-full px-5 py-3 outline-none focus:outline-none hover:bg-zinc-100"
          :href="entry.url"
          rel="noopener noreferrer"
          target="_blank"
          @click.stop
        >
          <font-awesome-icon
            icon="external-link-alt"
            class="text-zinc-500 mr-2"
            size="sm"
          />
          {{ entry.title }}
        </a>
        <hr v-if="Boolean(entries.length)" class="" />
        <a
          v-for="locale in $i18n.locales"
          :key="locale.code"
          :class="[
            'w-full px-5 py-3 outline-none focus:outline-none hover:bg-zinc-100',
            locale.code === $i18n.locale && 'bg-zinc-200',
          ]"
          href="#"
          @click.prevent="setLocale(locale.code)"
        >
          <span class="mr-2" :class="`flag:${locale.flag}`"></span>
          {{ locale.name }}
        </a>
      </div>
    </TDropdown>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { TDropdown } from 'vue-tailwind/dist/components'
import { mapActions } from 'vuex'

import { NavMenuEntry } from '@/utils/types'
import 'country-flag-icons/3x2/flags.css'

export default Vue.extend({
  components: {
    TDropdown,
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
    ...mapActions({
      setSiteLocale: 'site/setLocale',
    }),
    fetchConfig() {
      fetch(
        `${this.$vidoConfig.API_ENDPOINT}/${this.$vidoConfig.API_PROJECT}/${this.$vidoConfig.API_THEME}/articles?slug=non-classe`
      )
        .then((data) => data.json())
        .then((data) => (this.entries = data))
    },
    setLocale(locale: string) {
      this.$i18n.setLocale(locale)
      this.setSiteLocale(locale)
    },
  },
})
</script>

<style scoped>
[class*=' flag:'],
[class^='flag:'] {
  font-size: 0.7rem;
}
</style>
