<template>
  <div>
    <ul>
      <li>
        <a :href="urlCsv">
          {{ $tc('poisTable.downloadCsv') }}
        </a>
      </li>
      <li>
        <a :href="urlGeojson">
          {{ $tc('poisTable.downloadGeojson') }}
        </a>
      </li>
    </ul>

    <p>
      <a :href="`/${categoryId}/`">{{ $tc('poisTable.showOnMap') }}</a>
    </p>

    <t-rich-select
      :options="menuEntries"
      :value="categoryId"
      @input="onMenuChange"
    />

    <PoisTable v-if="pois" :fields="fields" :pois="pois" />
    <font-awesome-icon
      v-else
      icon="spinner"
      class="text-zinc-400 animate-spin"
      size="3x"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import PoisTable from '~/components/PoisList/PoisTable.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import {
  ApiPois,
  FieldsListItem,
  getPoiByCategoryId,
  getPoiByCategoryIdUrl,
} from '~/lib/apiPois'

export default Vue.extend({
  components: {
    PoisTable,
  },

  props: {
    menuItems: {
      type: Array as PropType<MenuItem[]>,
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
    fields(): FieldsListItem[] {
      return (
        (this.pois?.features &&
          this.pois.features[0].properties.editorial?.list_fields) || [
          { field: 'name' },
        ]
      )
    },

    urlCsv(): string {
      return this.url('csv')
    },

    urlGeojson(): string {
      return this.url('geojson')
    },

    menuEntries(): { value: number; text: string }[] {
      const menuIndex: { [key: number]: MenuItem } = {}
      this.menuItems.forEach((menuItem) => {
        menuIndex[menuItem.id] = menuItem
      })

      return (
        this.menuItems.filter(
          (menuItem) => menuItem.category
        ) as ApiMenuCategory[]
      ).map((menuItem) => {
        const parents: string[] = []
        let parentId = menuItem.parent_id
        while (parentId) {
          const name = menuIndex[parentId].menu_group?.name.fr
          if (name && menuIndex[parentId].parent_id) {
            parents.push(name)
          }
          parentId = menuIndex[parentId].parent_id
        }

        return {
          value: menuItem.id,
          text: [...parents.reverse(), menuItem.category.name.fr].join(' > '),
        }
      })
    },
  },

  watch: {
    categoryId() {
      this.pois = undefined

      // // FIXME, we should do this, but it rerender the page client side and it require server side config
      // this.$router.push({
      //   path: `/category/${this.categoryId}`,
      //   query: this.$router.currentRoute.query,
      // })

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
    url(format: 'geojson' | 'csv'): string {
      return getPoiByCategoryIdUrl(
        this.$vidoConfig().API_ENDPOINT,
        this.$vidoConfig().API_PROJECT,
        this.$vidoConfig().API_THEME,
        this.$route.params.id,
        {
          geometry_as: 'point',
          short_description: false,
          format: format,
        }
      )
    },

    onMenuChange(newCategoryId: number) {
      this.categoryId = newCategoryId
    },
  },
})
</script>
