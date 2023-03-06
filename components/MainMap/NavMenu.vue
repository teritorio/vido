<template>
  <section v-if="entries.length + locales.length > 0" class="relative z-40">
    <v-menu offset-y>
      <template #activator="{ on }">
        <IconButton :label="$t('navMenu.label')" class="w-11 h-11" v-on="on">
          <font-awesome-icon icon="cog" class="text-zinc-800" size="lg" />
        </IconButton>
      </template>

      <v-list>
        <v-list-item
          v-for="entry in entries"
          :key="entry.post_id"
          class="w-full px-5 py-3 hover:bg-zinc-100"
        >
          <v-list-item-title>
            <ExternalLink
              :href="entry.url"
              rel="noopener noreferrer"
              target="_blank"
              @click="openLink(entry.title, entry.url)"
            >
              {{ entry.title }}
            </ExternalLink>
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="Boolean(entries.length)"></v-divider>
        <v-list-item
          v-for="locale in locales"
          :key="locale.code"
          :class="[
            'w-full px-5 py-3 hover:bg-zinc-100',
            locale.code === $i18n.locale && 'bg-zinc-200',
          ]"
        >
          <v-list-item-title>
            <a href="#" @click.prevent="setLocale(locale.code)">
              <span class="mr-2" :class="`flag:${locale.flag}`"></span>
              {{ locale.name }}
            </a>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </section>
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { LocaleObject } from 'vue-i18n-routing'

import { useNuxtApp } from '#app'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import IconButton from '~/components/UI/IconButton.vue'
import { ContentEntry } from '~/lib/apiContent'
import { siteStore } from '~/stores/site'

export default defineComponent({
  components: {
    IconButton,
    ExternalLink,
  },

  props: {
    entries: {
      type: Array as PropType<ContentEntry[]>,
      required: true,
    },
  },

  computed: {
    ...mapWritableState(siteStore, ['locale']),

    locales(): LocaleObject[] {
      return useI18n().locales.value as unknown as LocaleObject[]
    },
  },

  methods: {
    setLocale(locale: string) {
      this.$i18n.locale = locale
      this.locale = locale
    },
    openLink(title: string, url: string) {
      const { $tracking } = useNuxtApp()
      $tracking({
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
