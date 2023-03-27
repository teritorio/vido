<template>
  <div class="tw-flex tw-flex-col tw-w-full tw-h-full">
    <MapPois
      :extra-attributions="settings.attributions"
      :features="pois ? pois.features : []"
      :feature-ids="ids"
    />
  </div>
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'

import {
  useHead,
  useRequestHeaders,
  useRoute,
  useRuntimeConfig,
  defineNuxtComponent,
} from '#app'
import { definePageMeta } from '#imports'
import MapPois from '~/components/Map/MapPois.vue'
import { getPois, ApiPois, ApiPoiId } from '~/lib/apiPois'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { vidoConfig } from '~/plugins/vido-config'
import { siteStore } from '~/stores/site'
import { VidoConfig } from '~/utils/types-config'

export default defineNuxtComponent({
  components: {
    MapPois,
  },

  async setup(): Promise<{
    config: VidoConfig
    settings: Settings
    pois: ApiPois | null
  }> {
    definePageMeta({
      validate({ params }) {
        return (
          typeof params.ids === 'string' &&
          /^[,-_:a-zA-Z0-9]+$/.test(params.ids)
        )
      },
    })

    const params = useRoute().params
    const config: VidoConfig =
      siteStore().config || vidoConfig(useRequestHeaders(), useRuntimeConfig())

    const fetchSettings = siteStore().settings
      ? Promise.resolve(siteStore().settings as Settings)
      : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)

    let settings: Settings | null
    let pois: ApiPois | null
    if (params.ids) {
      const ids = (params.ids as string).split(',')
      const getPoiPromise = getPois(
        config.API_ENDPOINT,
        config.API_PROJECT,
        config.API_THEME,
        ids,
        {
          geometry_as: undefined,
        }
      )
      ;[settings, pois] = await Promise.all([fetchSettings, getPoiPromise])
    } else {
      ;[settings] = await Promise.all([fetchSettings])
      pois = null
    }

    useHead(headerFromSettings(settings))

    return Promise.resolve({
      config,
      settings,
      pois,
    })
  },

  computed: {
    ...mapWritableState(siteStore, {
      locale: 'locale',
      globalConfig: 'config',
    }),

    ids(): ApiPoiId[] {
      return (
        this.pois?.features.map((feature) => feature.properties.metadata.id) ||
        []
      )
    },
  },

  created() {
    this.globalConfig = this.config!

    this.$settings.set(this.settings)
  },

  beforeMount() {
    this.$trackingInit(this.config!)
    this.$vidoConfigSet(this.config!)
  },

  mounted() {
    this.locale = this.$i18n.locale
  },
})
</script>

<style scoped>
body,
#__nuxt,
#__layout {
  @apply tw-h-full tw-w-full tw-overflow-hidden tw-overscroll-none;
}

:deep(#map-container) {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
