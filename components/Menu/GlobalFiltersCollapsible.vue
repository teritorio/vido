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

const isFiltered = computed(() => {
  return props.filtersMap.some(entry => filterValuesIsSet(entry.filtersValues))
})
</script>

<template>
  <div class="tw-flex tw-flex-col">
    <button
      type="button"
      :title="t('headerMenu.filterTitle')"
      class="tw-flex tw-items-center tw-w-full tw-h-12 sm:tw-h-8 tw-text-left tw-cursor-pointer tw-rounded-lg tw-outline-none focus:tw-outline-none tw-transition-colors hover:tw-bg-zinc-100"
      :class="[
        isFiltered ? 'tw-text-emerald-500' : 'tw-text-zinc-500',
      ]"
      @click="isOpen = !isOpen"
    >
      <FontAwesomeIcon
        :icon="isOpen ? 'chevron-up' : 'chevron-down'"
        class="tw-transition-transform"
        size="sm"
      />
      <FontAwesomeIcon icon="filter" size="sm" class="tw-ml-2" />
      <span class="tw-ml-2">
        {{ isFiltered ? t('headerMenu.editFilters') : t('headerMenu.filter') }}
      </span>
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

    <VDivider
      class="tw-mt-2 border-opacity-100"
      :class="{ 'md:tw-hidden': !isOpen }"
      role="presentation"
    />
  </div>
</template>
