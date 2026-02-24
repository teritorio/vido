<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FilterCompo from '~/components/Menu/Filter.vue'
import type { FilterValues } from '~/utils/types-filters'
import { filterValuesIsSet } from '~/utils/types-filters'

const props = defineProps<{
  filtersMap: { id: number, filtersValues: FilterValues }[]
}>()

defineEmits<{
  (e: 'activateFilter', val: boolean): void
}>()

const { t } = useI18n()
const isOpen = ref(false)

const activeCount = computed((): number => {
  return props.filtersMap.reduce((count, entry) => {
    return count + entry.filtersValues.filter(f => filterValuesIsSet([f])).length
  }, 0)
})
</script>

<template>
  <div class="tw-flex tw-flex-col">
    <button
      type="button"
      class="tw-flex tw-items-center tw-justify-between tw-w-full tw-cursor-pointer tw-py-1"
      @click="isOpen = !isOpen"
    >
      <div class="tw-flex tw-items-center tw-gap-2">
        <FontAwesomeIcon icon="filter" class="tw-text-zinc-500" size="sm" />
        <span class="tw-text-sm tw-font-medium tw-text-zinc-700">
          {{ t('headerMenu.filter') }}
        </span>
        <span
          v-if="activeCount > 0"
          class="tw-inline-flex tw-items-center tw-justify-center tw-min-w-5 tw-h-5 tw-px-1.5 tw-rounded-full tw-bg-indigo-500 tw-text-white tw-text-xs tw-font-semibold"
        >
          {{ activeCount }}
        </span>
      </div>
      <FontAwesomeIcon
        :icon="isOpen ? 'chevron-up' : 'chevron-down'"
        class="tw-text-zinc-400 tw-transition-transform"
        size="sm"
      />
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
