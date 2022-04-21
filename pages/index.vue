<template>
  <Home
    v-if="settings"
    :settings="settings"
    :initial-category-ids="categoryIds"
    :initial-poi="initialPoi"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { mapActions } from 'vuex'

import Home from '@/components/Home/Home.vue'
import { Category, getMenu } from '@/lib/apiMenu'
import { getPoiById, ApiPoi } from '@/lib/apiPois'
import { getSettings, headerFromSettings, Settings } from '@/lib/apiSettings'
import { vidoConfig } from '@/plugins/vido-config'

export default Vue.extend({
  components: {
    Home,
  },

  async asyncData({ params, route, req }): Promise<{
    settings: Settings | null
    categories: Category[] | null
    categoryIds: number[] | null
    initialPoi: ApiPoi | null
  }> {
    const fetchSettings = getSettings(
      vidoConfig(req).API_ENDPOINT,
      vidoConfig(req).API_PROJECT,
      vidoConfig(req).API_THEME
    )
    const fetchCategories = getMenu(
      vidoConfig(req).API_ENDPOINT,
      vidoConfig(req).API_PROJECT,
      vidoConfig(req).API_THEME
    )

    let categoryIdsJoin: string | null
    let poiId: string | null
    // Workaround Nuxt missing feature to simple respect trialling slash meaning
    if (params.poiId) {
      categoryIdsJoin = params.p1
      poiId = params.poiId
    } else if (route.path.endsWith('/')) {
      categoryIdsJoin = params.p1
      poiId = null
    } else {
      categoryIdsJoin = null
      poiId = params.p1
    }

    const categoryIds =
      (categoryIdsJoin &&
        categoryIdsJoin.split(',').map((id) => parseInt(id))) ||
      null
    let fetchPoi: Promise<ApiPoi | null> = Promise.resolve(null)
    if (poiId) {
      fetchPoi = getPoiById(
        vidoConfig(req).API_ENDPOINT,
        vidoConfig(req).API_PROJECT,
        vidoConfig(req).API_THEME,
        poiId
      )
    }

    const v = await Promise.all([fetchSettings, fetchCategories, fetchPoi])

    return Promise.resolve({
      settings: v[0],
      categories: v[1],
      categoryIds,
      initialPoi: v[2],
    })
  },

  data(): {
    settings: Settings | null
    categories: Category[] | null
  } {
    return {
      settings: null,
      categories: null,
    }
  },

  head(): MetaInfo {
    return headerFromSettings(this.settings)
  },

  created() {
    this.$store.dispatch('menu/fetchConfig', {
      categories: this.categories,
    })
  },

  mounted() {
    this.setSiteLocale(this.$i18n.locale)
  },

  methods: {
    ...mapActions({
      setSiteLocale: 'site/setLocale',
    }),
  },
})
</script>

<style>
html {
  @apply h-full w-full box-border overflow-hidden overscroll-none;
}

html,
.mapboxgl-map {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  @apply text-zinc-900;
}

body,
#__nuxt,
#__layout {
  @apply h-full w-full overflow-hidden overscroll-none;
}

*,
*::before,
*::after {
  @apply m-0 box-border;
}
</style>
