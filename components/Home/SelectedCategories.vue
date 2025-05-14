<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { menuStore as useMenuStore } from '~/stores/menu'
import { getContrastedColors } from '~/composables/useFeature'

const { t } = useI18n()
const menuStore = useMenuStore()
const { selectedCategories } = storeToRefs(menuStore)

function getItem(item: ApiMenuCategory) {
  return item.menu_group || item.link || item.category || {}
}

function getTeritorioIconBadgeProps(item: ApiMenuCategory) {
  const base = getItem(item)
  const { colorFill, colorText } = getContrastedColors(base.color_fill, base.color_text)

  return {
    id: item.id,
    picto: base.icon,
    colorFill,
    colorText,
    size: 'lg',
  }
}
</script>

<template>
  <div
    v-if="selectedCategories && selectedCategories.length > 0"
    class="tw-relative"
  >
    <div class="tw-flex tw-flex-row tw-pointer-events-auto">
      <div
        class="tw-flex tw-flex-row tw-p-2 tw-flex-wrap tw-bg-white tw-shadow-md tw-rounded-xl"
        style="min-width: 64px"
      >
        <div
          v-for="menuItem in selectedCategories"
          :id="`selected-category-${menuItem.id}`"
          :key="menuItem.id"
          :title="getItem(menuItem).name.fr"
          class="tw-m-1 tw-relative"
        >
          <TeritorioIconBadge v-bind="getTeritorioIconBadgeProps(menuItem)" />
          <button
            type="button"
            class="tw-flex tw-items-center tw-justify-center tw-text-white tw-text-center tw-rounded-full tw-absolute -tw-top-1 -tw-right-1 tw-w-5 tw-h-5 tw-border-solid tw-border-2 tw-border-white tw-bg-red-600 hover:tw-bg-red-800"
            :title="t('headerMenu.hideCategory')"
            @click="menuStore.delSelectedCategoryIds([menuItem.id])"
          >
            <span class="tw-sr-only">{{
              t('headerMenu.disableCategory')
            }}</span>
            <FontAwesomeIcon icon="times" class="tw-text-white" size="sm" />
          </button>
        </div>
      </div>
    </div>
    <button
      v-if="selectedCategories.length > 1"
      type="button"
      class="tw-absolute -tw-top-3 -tw-right-3 tw-pointer-events-auto tw-flex tw-items-center tw-justify-center tw-text-white tw-text-center tw-rounded-full tw-w-7 tw-h-7 tw-border-solid tw-border-2 tw-border-white tw-bg-red-600 hover:tw-bg-red-800"
      :title="t('headerMenu.clearAllCategories')"
      :aria-label="t('headerMenu.clearAllCategories')"
      @click="menuStore.clearSelectedCategoryIds"
    >
      <FontAwesomeIcon icon="times" class="tw-text-white" />
    </button>
  </div>
</template>
