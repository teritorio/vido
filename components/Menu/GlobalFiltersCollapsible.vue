<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FilterCompo from '~/components/Menu/Filter.vue'
import type { FilterValues } from '~/utils/types-filters'

defineProps<{
  filtersMap: { id: number, filtersValues: FilterValues }[]
}>()

defineEmits<{
  (e: 'activateFilter', val: boolean): void
}>()

const { t } = useI18n()
const isOpen = ref(false)
</script>

<template>
  <div class="tw-flex tw-flex-col">
    <button
      type="button"
      class="tw-flex tw-items-center tw-justify-between tw-w-full tw-cursor-pointer tw-py-1 tw-rounded-lg tw-transition-colors hover:tw-bg-zinc-100"
      @click="isOpen = !isOpen"
    >
      <div class="tw-flex tw-items-center tw-gap-2">
        <FontAwesomeIcon
          :icon="isOpen ? 'chevron-up' : 'chevron-down'"
          class="tw-text-zinc-400 tw-transition-transform"
          size="sm"
        />
        <FontAwesomeIcon icon="filter" class="tw-text-zinc-500" size="sm" />
        <span class="tw-text-sm tw-font-medium tw-text-zinc-700">
          {{ t('headerMenu.filter') }}
        </span>
      </div>
    </button>

    <div v-show="isOpen" class="tw-pt-2">
      <template v-for="entry in filtersMap" :key="`collapsible-${entry.id}`">
        <FilterCompo
          :id="entry.id"
          :filters-values="entry.filtersValues"
          global
          @activate-filter="$emit('activateFilter', $event)"
        />
      </template>
    </div>
  </div>
</template>
