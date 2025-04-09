<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { menuStore as useMenuStore } from '~/stores/menu'

const { t } = useI18n()
const menuStore = useMenuStore()
const { selectedCategories } = storeToRefs(menuStore)
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
          :title="(menuItem.menu_group || menuItem.link || menuItem.category).name.fr"
          class="tw-m-1 tw-relative"
        >
          <TeritorioIconBadge
            :id="menuItem.id"
            :color-fill="(menuItem.menu_group || menuItem.link || menuItem.category).color_fill"
            :picto="(menuItem.menu_group || menuItem.link || menuItem.category).icon"
            size="lg"
          />
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
