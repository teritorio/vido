<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { menuStore as useMenuStore } from '~/stores/menu'
import { getContrastedColors } from '~/composables/useFeature'

defineProps<{
  categories: ApiMenuCategory[]
}>()

defineEmits<{
  (e: 'showMap'): void
}>()

const device = useDevice()
const menuStore = useMenuStore()

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
  <div class="selected-categories">
    <h3>{{ $t('selectedCategories.label') }}</h3>
    <div class="selected-categories-wrapper">
      <div>
        <VBtn
          v-for="category in categories"
          :key="category.id"
          :data-testid="`selected-category-${category.id}`"
          :aria-label="`${$t('headerMenu.disableCategory')}: ${getItem(category).name.fr}`"
          :title="`${$t('headerMenu.disableCategory')}: ${getItem(category).name.fr}`"
          icon
          width="40px"
          height="40px"
          @click="menuStore.delSelectedCategoryIds([category.id])"
        >
          <TeritorioIconBadge v-bind="getTeritorioIconBadgeProps(category)" />
          <span class="disable-category v-btn__content">
            <FontAwesomeIcon icon="times" size="sm" />
          </span>
        </VBtn>
      </div>
    </div>
    <VBtn
      v-if="categories.length && device.smallScreen"
      @click="$emit('showMap')"
    >
      <template #prepend>
        <FontAwesomeIcon icon="map" />
      </template>
      {{ $t('menuNavbar.actions.goToMap') }}
    </VBtn>
    <VBtn
      v-if="categories.length > 1"
      :title="$t('headerMenu.clearAllCategories')"
      :aria-label="$t('headerMenu.clearAllCategories')"
      class="disable-all-categories"
      icon
      color="#dc2626"
      width="28px"
      height="28px"
      @click="menuStore.clearSelectedCategoryIds"
    >
      <FontAwesomeIcon icon="trash" />
    </VBtn>
  </div>
</template>

<style lang="css" scoped>
.selected-categories,
.selected-categories-wrapper > div {
  display: flex;
  gap: 0.5rem;
}

.selected-categories {
  min-width: 0;
  position: relative;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: #f4f4f5;
}

.selected-categories-wrapper {
  overflow-x: auto;
  padding: 0.5rem 0;
}

.disable-category,
.disable-all-categories {
  position: absolute;
  top: 0;
  right: 0;
  border: 2px solid #FFF;
}

.disable-category {
  transform: translate(25%, -25%);
  background-color: #dc2626;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff;
}

h3 {
  font-weight: bold;
}

:deep(.v-btn__content button) {
  position: absolute;
}

@media (width >= 768px) {
  .selected-categories {
    flex-shrink: 0;
    align-self: flex-start;
    pointer-events: all;
    background-color: #fff;
    border-radius: 0.75rem;
  }

  .disable-all-categories {
    transform: translate(50%, -50%);
  }

  .selected-categories-wrapper > div {
    flex-wrap: wrap;
  }

  .selected-categories-wrapper {
    overflow-x: visible;
  }

  h3 {
    display: none;
  }
}
</style>
