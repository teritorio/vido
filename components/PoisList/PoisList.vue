<template>
  <PoiLayout
    v-if="category !== undefined"
    :settings="settings"
    :nav-menu-entries="navMenuEntries"
    :name="category.category.name.fr"
    :icon="category.category.icon"
    :color-line="category.category.color_line"
    :color-fill="category.category.color_fill"
  >
    <template #actions>
      <Actions
        :category-id="categoryId"
        :color-line="category.category.color_line"
      />
    </template>
    <template #body>
      <CategorySelector
        :menu-items="apiMenuCategory || []"
        :category-id="categoryId"
        @category-change="onMenuChange"
      />

      <PoisTable v-if="pois" :fields="fields" :pois="pois" />
      <FontAwesomeIcon
        v-else
        icon="spinner"
        class="tw-text-zinc-400 tw-animate-spin"
        size="3x"
      />
    </template>
  </PoiLayout>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapState } from 'pinia'
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import PoiLayout from '~/components/Layout/PoiLayout.vue'
import Actions from '~/components/PoisList/Actions.vue'
import CategorySelector from '~/components/PoisList/CategorySelector.vue'
import PoisTable from '~/components/PoisList/PoisTable.vue'
import { ContentEntry } from '~/lib/apiContent'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { ApiPois, FieldsListItem, getPoiByCategoryId } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'
import { menuStore } from '~/stores/menu'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    Actions,
    PoiLayout,
    CategorySelector,
    PoisTable,
  },

  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
    navMenuEntries: {
      type: Array as PropType<ContentEntry[]>,
      required: true,
    },
    initialCategoryId: {
      type: Number,
      required: true,
    },
    initialPois: {
      type: Object as PropType<ApiPois>,
      required: true,
    },
  },

  data(): {
    categoryId: number
    pois: ApiPois | undefined
  } {
    return {
      categoryId: this.initialCategoryId,
      pois: this.initialPois,
    }
  },

  computed: {
    ...mapState(menuStore, ['apiMenuCategory']),

    category(): ApiMenuCategory | undefined {
      return Object.values(this.apiMenuCategory || {}).find(
        (menuItem) => menuItem.id == this.categoryId
      )
    },

    fields(): FieldsListItem[] {
      return (
        (this.pois?.features &&
          this.pois.features[0].properties.editorial?.list_fields) || [
          { field: 'name' },
        ]
      )
    },
  },

  watch: {
    categoryId() {
      this.pois = undefined

      this.$router.push({
        path: `/category/${this.categoryId}`,
        query: this.$router.currentRoute.value.query,
        hash: this.$router.currentRoute.value.hash,
      })

      getPoiByCategoryId(
        this.$vidoConfig().API_ENDPOINT,
        this.$vidoConfig().API_PROJECT,
        this.$vidoConfig().API_THEME,
        this.categoryId,
        {
          geometry_as: 'point',
          short_description: true,
        }
      ).then((pois) => {
        this.pois = pois
      })
    },
  },

  methods: {
    onMenuChange(newCategoryId: number) {
      this.categoryId = newCategoryId
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/details.scss';

h1 {
  font-size: 2.4rem;
  text-align: center;
  margin: 0.6rem 0.3rem 0;
  text-transform: uppercase;
}
</style>
