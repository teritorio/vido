<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import copy from 'fast-copy'
import type {
  FilterValueBoolean,
  FilterValueDate,
  FilterValueList,
  FilterValueNumberRange,
  FilterValues,
} from '~/utils/types-filters'
import { isSet } from '~/utils/types-filters'
import SelectFilter from '~/components/Filters/Select.vue'
import DateRange from '~/components/Filters/DateRange.vue'
import NumberRange from '~/components/Filters/NumberRange.vue'
import { menuStore as useMenuStore } from '~/stores/menu'

const props = defineProps<{
  filtersMap: { id: number, filtersValues: FilterValues }[]
}>()

const emit = defineEmits<{
  (e: 'activateFilter', val: boolean): void
}>()

const { t } = useI18n()
const menuStore = useMenuStore()
const openChipKey = ref<string | null>(null)

interface FlatFilter {
  groupId: number
  filterIndex: number
  filter: FilterValues[number]
  key: string
  label: string
}

const flatFilters = computed((): FlatFilter[] => {
  return props.filtersMap.flatMap(entry =>
    entry.filtersValues.map((filter, filterIndex) => ({
      groupId: entry.id,
      filterIndex,
      filter,
      key: `${entry.id}-${filterIndex}`,
      label: 'property' in filter.def
        ? (filter.def.name?.fr || filter.def.property.join('.'))
        : `filter-${filterIndex}`,
    })),
  )
})

function toggleChip(key: string) {
  openChipKey.value = openChipKey.value === key ? null : key
}

function applyChange(groupId: number, filterIndex: number, filters: FilterValues) {
  menuStore.applyGlobalFilters({
    groupId,
    filterValues: filters,
  })
}

function onBooleanChange(flat: FlatFilter, event: Event) {
  const target = event.target as HTMLInputElement
  const entry = props.filtersMap.find(e => e.id === flat.groupId)
  if (!entry)
    return
  const filters = copy(entry.filtersValues)
  const filter = filters[flat.filterIndex] as FilterValueBoolean
  filter.filterValue = target.checked
  applyChange(flat.groupId, flat.filterIndex, filters)
}

function onSelectionChange(flat: FlatFilter, values: string[] | undefined) {
  const entry = props.filtersMap.find(e => e.id === flat.groupId)
  if (!entry)
    return
  const filters = copy(entry.filtersValues)
  const filter = filters[flat.filterIndex] as FilterValueList
  filter.filterValues = values || []
  applyChange(flat.groupId, flat.filterIndex, filters)
}

function onCheckboxChange(flat: FlatFilter, val: string, checked: boolean) {
  const entry = props.filtersMap.find(e => e.id === flat.groupId)
  if (!entry)
    return
  const filters = copy(entry.filtersValues)
  const filter = filters[flat.filterIndex] as FilterValueList
  if (checked && !filter.filterValues.includes(val))
    filter.filterValues.push(val)
  else if (!checked)
    filter.filterValues = filter.filterValues.filter(k => k !== val)
  applyChange(flat.groupId, flat.filterIndex, filters)
}

function onDateChange(flat: FlatFilter, filterValue: FilterValueDate) {
  const entry = props.filtersMap.find(e => e.id === flat.groupId)
  if (!entry)
    return
  const filters = copy(entry.filtersValues)
  filters[flat.filterIndex] = filterValue
  applyChange(flat.groupId, flat.filterIndex, filters)
}

function onNumberRangeChange(flat: FlatFilter, filterValue: FilterValueNumberRange) {
  const entry = props.filtersMap.find(e => e.id === flat.groupId)
  if (!entry)
    return
  const filters = copy(entry.filtersValues)
  filters[flat.filterIndex] = filterValue
  applyChange(flat.groupId, flat.filterIndex, filters)
}
</script>

<template>
  <div class="tw-flex tw-flex-col tw-gap-2">
    <div class="tw-flex tw-items-center tw-gap-2">
      <FontAwesomeIcon icon="filter" class="tw-text-zinc-500" size="sm" />
      <span class="tw-text-sm tw-font-medium tw-text-zinc-700">
        {{ t('headerMenu.filter') }}
      </span>
    </div>

    <div class="tw-flex tw-gap-2 tw-overflow-x-auto tw-pb-1 chips-scroll">
      <button
        v-for="flat in flatFilters"
        :key="flat.key"
        type="button"
        class="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-rounded-full tw-text-sm tw-whitespace-nowrap tw-border tw-transition-all tw-cursor-pointer tw-flex-shrink-0"
        :class="isSet(flat.filter)
          ? 'tw-border-indigo-400 tw-bg-indigo-50 tw-text-indigo-700'
          : 'tw-border-zinc-200 tw-bg-white tw-text-zinc-600 hover:tw-border-zinc-300 hover:tw-bg-zinc-50'
        "
        @click="toggleChip(flat.key)"
      >
        <span
          v-if="isSet(flat.filter)"
          class="tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-indigo-500"
        />
        {{ flat.label }}
        <FontAwesomeIcon
          :icon="openChipKey === flat.key ? 'chevron-up' : 'chevron-down'"
          size="xs"
          class="tw-opacity-60"
        />
      </button>
    </div>

    <div
      v-for="flat in flatFilters"
      :key="`popover-${flat.key}`"
    >
      <div v-if="openChipKey === flat.key" class="tw-pt-1">
        <div v-if="flat.filter.type === 'boolean'">
          <label class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-zinc-800 tw-cursor-pointer">
            <input
              type="checkbox"
              class="tw-text-emerald-500 tw-rounded-full focus:tw-ring-0 focus:tw-ring-transparent"
              :checked="flat.filter.filterValue"
              @change="onBooleanChange(flat, $event)"
            >
            {{ flat.label }}
          </label>
        </div>

        <div v-else-if="flat.filter.type === 'multiselection'">
          <SelectFilter
            :filter="flat.filter"
            @change="onSelectionChange(flat, $event)"
            @click="emit('activateFilter', true)"
            @blur="emit('activateFilter', false)"
          />
        </div>

        <div v-else-if="flat.filter.type === 'checkboxes_list'">
          <label
            v-for="value in flat.filter.def.values"
            :key="value.value"
            class="tw-flex tw-items-center tw-gap-2 tw-py-0.5 tw-text-sm tw-text-zinc-800 tw-cursor-pointer"
          >
            <input
              type="checkbox"
              class="tw-text-emerald-500 tw-rounded-full focus:tw-ring-0 focus:tw-ring-transparent"
              :checked="flat.filter.filterValues.includes(value.value)"
              @change="onCheckboxChange(flat, value.value, ($event.target as HTMLInputElement).checked)"
            >
            {{ (value.name && value.name.fr) || value.value }}
          </label>
        </div>

        <div v-else-if="flat.filter.type === 'date_range'">
          <DateRange
            :filter="flat.filter"
            @change="onDateChange(flat, $event)"
          />
        </div>

        <div v-else-if="flat.filter.type === 'number_range'">
          <NumberRange
            :filter="flat.filter"
            @change="onNumberRangeChange(flat, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.chips-scroll {
  scrollbar-width: thin;
}

.chips-scroll::-webkit-scrollbar {
  height: 4px;
}

.chips-scroll::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}
</style>
