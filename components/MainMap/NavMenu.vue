<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import { useLocale } from 'vuetify'
import { VDivider } from 'vuetify/components/VDivider'
import { VList, VListItem } from 'vuetify/components/VList'
import { VMenu } from 'vuetify/components/VMenu'
import IconButton from '~/components/UI/IconButton.vue'
import VFlag from '~/components/UI/VFlag.vue'
import { getSlugFromURL } from '~/lib/apiArticle'
import { useSiteStore } from '~/stores/site'

const { $tracking } = useNuxtApp()
const { articles: entries, locale: currentI18n, config } = storeToRefs(useSiteStore())
const { current: vuetifyLocale } = useLocale()
const { locales, setLocale, localeProperties } = useI18n() // LocaleObject[]

async function updateLocale(value: string): Promise<void> {
  await setLocale(value)
  currentI18n.value = value
  vuetifyLocale.value = value
}

function handleClick(title: string, url: string): void {
  $tracking({
    type: 'external_link',
    url,
    title,
  })
}

function isExternalLink(url: string): boolean {
  return /^https?:?\/\//.test(url)
}

function isAPIUrl(url: string): boolean {
  return url.includes(config.value!.API_ENDPOINT)
}

function getLinkTo(url: string) {
  return isExternalLink(url) && !isAPIUrl(url)
    ? url
    : {
        name: 'articles-slug',
        params: { slug: getSlugFromURL(url) },
      }
}
</script>

<template>
  <section v-if="entries.length + locales.length > 0" class="nav-menu tw-relative tw-z-40">
    <VMenu offset-y>
      <template #activator="{ props }">
        <IconButton
          :label="$t('navMenu.label')"
          class="tw-w-11 tw-h-11 tw-pointer-events-auto"
          v-bind="{ ...$attrs, ...props }"
        >
          <FontAwesomeIcon icon="cog" class="tw-text-zinc-800" size="lg" />
        </IconButton>
      </template>
      <VList id="nav-menu-dropdown">
        <template v-for="(entry, index) in entries" :key="index">
          <NuxtLink
            v-slot="{ href }"
            custom
            :to="getLinkTo(entry.url)"
          >
            <VListItem
              class="tw-w-full tw-px-5 tw-py-3 hover:tw-bg-zinc-100"
              :href="href"
              @click="handleClick(entry.title, entry.url)"
            >
              {{ entry.title }}
            </VListItem>
          </NuxtLink>
        </template>
        <VDivider v-if="Boolean(entries.length)" />
        <VListItem
          v-for="locale in locales"
          :key="typeof locale === 'string' ? locale : locale.code"
          :class="[typeof locale !== 'string' && locale.code === localeProperties.code && 'bg-grey-lighten-2']"
          class="tw-w-full tw-px-5 tw-py-3 hover:tw-bg-zinc-100"
          @click="updateLocale(typeof locale === 'string' ? locale : locale.code)"
        >
          <template v-if="(typeof locale !== 'string')">
            <VFlag :flag="locale.flag" class="flag" />
            {{ locale.name }}
          </template>
          <template v-else>
            {{ locale }}
          </template>
        </VListItem>
      </VList>
    </VMenu>
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
