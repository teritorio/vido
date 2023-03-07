<template>
  <section v-if="entries.length + $i18n.locales.length > 0">
    <TDropdown
      :classes="{
        dropdown:
          'origin-top-right absolute right-0 rounded shadow bg-white mt-1',
        dropdownWrapper: 'relative z-40',
      }"
    >
      <template
        #trigger="{
          mousedownHandler,
          focusHandler,
          blurHandler,
          keydownHandler,
        }"
      >
        <IconButton
          :label="$tc('navMenu.label')"
          class="w-11 h-11"
          @mousedown="mousedownHandler"
          @focus="focusHandler"
          @blur="blurHandler"
          @keydown="keydownHandler"
        >
          <font-awesome-icon icon="cog" class="text-zinc-800" size="lg" />
        </IconButton>
      </template>

      <div class="py-1 rounded-md shadow-xs flex flex-col w-max">
        <ExternalLink
          v-for="entry in entries"
          :key="entry.post_id"
          class="w-full px-5 py-3 hover:bg-zinc-100"
          :href="entry.url"
          rel="noopener noreferrer"
          target="_blank"
          @click="openLink(entry.title, entry.url)"
        >
          {{ entry.title }}
        </ExternalLink>
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
import { mapWritableState } from 'pinia'
import Vue, { PropType } from 'vue'
import { TDropdown } from 'vue-tailwind/dist/components'

import ExternalLink from '~/components/UI/ExternalLink.vue'
import IconButton from '~/components/UI/IconButton.vue'
import { ContentEntry } from '~/lib/apiContent'
import { siteStore } from '~/stores/site'

export default Vue.extend({
  components: {
    IconButton,
    ExternalLink,
    TDropdown,
  },

  props: {
    entries: {
      type: Array as PropType<ContentEntry[]>,
      required: true,
    },
  },

  computed: {
    ...mapWritableState(siteStore, ['locale']),
  },

  methods: {
    setLocale(locale: string) {
      this.$i18n.setLocale(locale)
      this.locale = locale
    },
    openLink(title: string, url: string) {
      this.$tracking({
        type: 'external_link',
        url,
        title,
      })
    },
  },
})
</script>

<style scoped>
[class*=' flag:'],
[class^='flag:'] {
  display: inline-block;
  background-size: cover;
  height: 1em;
  width: 1.5em;
  font-size: 0.7rem;
}

.flag\:ES {
  background-image: url('~country-flag-icons/3x2/ES.svg');
}

.flag\:FR {
  background-image: url('~country-flag-icons/3x2/FR.svg');
}

.flag\:GB {
  background-image: url('~country-flag-icons/3x2/GB.svg');
}
</style>
