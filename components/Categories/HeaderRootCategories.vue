<template>
  <transition name="non-highlighted" appear>
    <div v-if="!collapsed" class="grid items-start grid-cols-4 gap-3">
      <CategoryButton
        v-for="menuItem in nonHighlightedMenuItems"
        :key="menuItem.id"
        :menu-item-id="menuItem.id"
        :color-fill="
          (menuItem.menu_group || menuItem.link || menuItem.category).color_fill
        "
        :label="
          (menuItem.menu_group || menuItem.link || menuItem.category).name.fr
        "
        :picto="
          (menuItem.menu_group || menuItem.link || menuItem.category).icon
        "
        :type="
          (menuItem.menu_group || menuItem.link || menuItem.category)
            .display_mode
        "
        :href="menuItem.link && menuItem.link.href"
        :active-sub-categories="getCategoryCount(menuItem.id)"
        @click="onMenuItemClick(menuItem)"
      />
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import CategoryButton from '~/components/Categories/CategoryButton/CategoryButton.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'

export default Vue.extend({
  components: {
    CategoryButton,
  },
  props: {
    menuItemId: {
      type: Number,
      required: true,
    },
    categoriesActivesubsCount: {
      type: Object as PropType<{ [id: string]: number }>,
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
    nonHighlightedMenuItems(): MenuItem[] {
      return this.getRootMenuItemFromCategoryId(this.menuItemId)
    },
  },
  methods: {
    onCollapseButtonClick() {
      this.collapsed = !this.collapsed
    },
    onMenuItemClick(menuItem: MenuItem) {
      this.$emit('menu-item-click', menuItem.id)
    },
    getCategoryCount(id: ApiMenuCategory['id']) {
      return this.categoriesActivesubsCount[id]
    },
  },
})
</script>

<style>
/* .non-highlighted-enter-active {
  transition: opacity 0.1s, transform 0.1s;
}

.non-highlighted-enter {
  opacity: 0.4;
  transform: translateY(-3px);
}

.non-highlighted-enter-to {
  opacity: 1;
  transform: translateY(0);
} */
</style>
