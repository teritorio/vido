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
import { ref, Ref } from 'vue'

import {
  useHead,
  useRequestHeaders,
  useRoute,
  useRuntimeConfig,
  defineNuxtComponent,
} from '#app'
import { definePageMeta, useAsyncData } from '#imports'
import MapPois from '~/components/Map/MapPois.vue'
import { getPois, ApiPois, ApiPoiId } from '~/lib/apiPois'
import { getSettings, headerFromSettings, Settings } from '~/lib/apiSettings'
import { throwFetchError } from '~/lib/throwFetchError'
import { vidoConfig } from '~/plugins/vido-config'
import { siteStore } from '~/stores/site'
import { VidoConfig } from '~/utils/types-config'

export default defineNuxtComponent({
  components: {
    MapPois,
  },

  async setup(): Promise<{
    config: VidoConfig
    settings: Ref<Settings>
    pois: Ref<ApiPois | null>
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
    const { data: configRef } = await useAsyncData(() =>
      Promise.resolve(
        siteStore().config ||
          vidoConfig(useRequestHeaders(), useRuntimeConfig())
      )
    )
    const config: VidoConfig = configRef.value!

    const fetchSettings = useAsyncData(() =>
      siteStore().settings
        ? Promise.resolve(siteStore().settings as Settings)
        : getSettings(config.API_ENDPOINT, config.API_PROJECT, config.API_THEME)
    )

    let settings: Ref<Settings | null>
    let pois: Ref<ApiPois | null>
    if (params.ids) {
      const ids = (params.ids as string).split(',')
      const getPoiPromise = useAsyncData(() =>
        getPois(
          config.API_ENDPOINT,
          config.API_PROJECT,
          config.API_THEME,
          ids,
          {
            geometry_as: undefined,
          }
        )
      )
      const [{ data: settingsF }, { data: poisF }] = await Promise.all([
        fetchSettings,
        getPoiPromise,
      ])
      throwFetchError([fetchSettings, getPoiPromise])

      settings = settingsF
      pois = poisF
    } else {
      const [{ data: settingsF }] = await Promise.all([fetchSettings])
      throwFetchError([fetchSettings])

      settings = settingsF
      pois = ref(null)
    }
    useHead(headerFromSettings(settings.value!))

    return {
      config,
      settings: settings as Ref<Settings>,
      pois: pois as Ref<ApiPois | null>,
    }
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
    this.globalConfig = this.config

    this.$settings.set(this.settings)
  },

  beforeMount() {
    this.$trackingInit(this.config)
    this.$vidoConfigSet(this.config)
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
