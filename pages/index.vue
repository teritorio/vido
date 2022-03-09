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

export default Vue.extend({
  components: {
    Home,
  },

  async asyncData({
    env,
    params,
  }): Promise<{
    settings: Settings | null
    categories: Category[] | null
    categoryIds: Number[] | null
    initialPoi: ApiPoi | null
  }> {
    const fetchSettings = getSettings(
      env.API_ENDPOINT,
      env.API_PROJECT,
      env.API_THEME
    )
    const fetchCategories = getMenu(
      env.API_ENDPOINT,
      env.API_PROJECT,
      env.API_THEME
    )

    const categoryIds =
      (params.categoryIds &&
        params.categoryIds.split(',').map((id) => parseInt(id))) ||
      null

    const poiId = (params.poiId && parseInt(params.poiId)) || null
    let fetchPoi: Promise<ApiPoi | null> = Promise.resolve(null)
    if (poiId) {
      fetchPoi = getPoiById(
        env.API_ENDPOINT,
        env.API_PROJECT,
        env.API_THEME,
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
  @apply text-gray-900;
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
