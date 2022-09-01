<template>
  <transition name="non-highlighted" appear>
    <div v-if="!collapsed" class="grid items-start grid-cols-4 gap-3">
      <template v-for="menuItem in menuItems">
        <MenuGroup
          v-if="menuItem.menu_group"
          :key="menuItem.id"
          :menu-group="menuItem"
          :categories-actives-count="
            categoriesActivesCountByParent[menuItem.id]
          "
          :size="size"
          @click="onMenuGroupClick(menuItem)"
        />
        <Link
          v-else-if="menuItem.link"
          :key="menuItem.id"
          :menu-link="menuItem"
          :size="size"
        />
        <Category
          v-else-if="menuItem.category"
          :key="menuItem.id"
          :category="menuItem"
          :selected="isCategorySelected(menuItem.id)"
          :filters="filters[menuItem.id]"
          :size="size"
          @click="onCategoryClick(menuItem)"
          @filter-click="onFilterClick"
        />
      </template>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import Category from '~/components/Categories/Category.vue'
import Link from '~/components/Categories/Link.vue'
import MenuGroup from '~/components/Categories/MenuGroup.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { FilterValues } from '~/utils/types-filters'

export default Vue.extend({
  components: {
    Category,
    MenuGroup,
    Link,
  },
  props: {
    menuItems: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
    filters: {
      type: Object as PropType<{ [categoryId: number]: FilterValues }>,
      required: true,
    },
    categoriesActivesCountByParent: {
      type: Object as PropType<{ [id: string]: number }>,
      required: true,
    },
    isCategorySelected: {
      type: Function,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  data(): {
    collapsed: boolean
  } {
    return {
      collapsed: false,
    }
  },
  computed: {
    ...mapGetters({
      getRootMenuItemFromCategoryId: 'menu/getRootMenuItemFromCategoryId',
    }),
  },
  methods: {
    onMenuGroupClick(menuItem: MenuItem) {
      this.$emit('menu-group-click', menuItem.id)
    },
    onCategoryClick(menuItem: MenuItem) {
      this.$emit('category-click', menuItem.id)
    },
    onFilterClick(categoryId: ApiMenuCategory['id']) {
      this.$emit('filter-click', categoryId)
    },
  },
})
</script>
