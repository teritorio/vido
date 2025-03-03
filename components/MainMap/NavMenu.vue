<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapWritableState } from 'pinia'
import type { PropType } from 'vue'
import type { LocaleObject } from 'vue-i18n-routing'
import { VDivider } from 'vuetify/components/VDivider'
import { VList, VListItem, VListItemTitle } from 'vuetify/components/VList'
import { VMenu } from 'vuetify/components/VMenu'
import { useLocale } from 'vuetify'
import { defineNuxtComponent } from '#app'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import IconButton from '~/components/UI/IconButton.vue'
import VFlag from '~/components/UI/VFlag.vue'
import type { Article } from '~/lib/apiArticle'
import { siteStore } from '~/stores/site'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    VMenu,
    VList,
    VListItem,
    VListItemTitle,
    VDivider,
    IconButton,
    ExternalLink,
    VFlag,
  },

  props: {
    entries: {
      type: Array as PropType<Article[]>,
      required: true,
    },
  },

  setup() {
    const { current } = useLocale()

    return {
      vuetifyLocale: current,
    }
  },

  computed: {
    ...mapWritableState(siteStore, ['locale']),

    locales(): LocaleObject[] {
      return this.$i18n.locales as unknown as LocaleObject[]
    },
  },

  methods: {
    async setLocale(locale: string) {
      await this.$i18n.setLocale(locale)
      this.locale = locale
      this.vuetifyLocale = locale
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

<template>
  <section v-if="entries.length + locales.length > 0" class="tw-relative tw-z-40">
    <v-menu offset-y>
      <template #activator="{ props }">
        <IconButton :label="$t('navMenu.label')" class="tw-w-11 tw-h-11 tw-pointer-events-auto" v-bind="props">
          <FontAwesomeIcon icon="cog" class="tw-text-zinc-800" size="lg" />
        </IconButton>
      </template>

      <v-list id="nav-menu-dropdown">
        <v-list-item v-for="(entry, index) in entries" :key="index" class="tw-w-full tw-px-5 tw-py-3 hover:tw-bg-zinc-100">
          <v-list-item-title>
            <ExternalLink
              :href="entry.url" rel="noopener noreferrer" target="_blank"
              @click="openLink(entry.title, entry.url)"
            >
              {{ entry.title }}
            </ExternalLink>
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="Boolean(entries.length)" />
        <v-list-item
          v-for="locale in locales" :key="locale.code" class="tw-w-full tw-px-5 tw-py-3 hover:tw-bg-zinc-100" :class="[
            locale.code === $i18n.locale && 'bg-grey-lighten-2',
          ]"
        >
          <v-list-item-title>
            <a href="#" @click.prevent="setLocale(locale.code)">
              <VFlag :flag="locale.flag" class="flag" />
              {{ locale.name }}
            </a>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </section>
</template>

<style scoped>
.flag {
  display: inline-block;
  height: 1em;
  width: 1.5em;
  font-size: 0.7rem;
}
</style>
