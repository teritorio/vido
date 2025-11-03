<script setup lang="ts">
import copy from 'fast-copy'
import DateRange from '~/components/Filters/DateRange.vue'
import NumberRange from '~/components/Filters/NumberRange.vue'
import SelectFilter from '~/components/Filters/Select.vue'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import { menuStore as useMenuStore } from '~/stores/menu'
import type {
  FilterValueBoolean,
  FilterValueDate,
  FilterValueList,
  FilterValueNumberRange,
  FilterValues,
} from '~/utils/types-filters'

const props = defineProps<{
  categoryId: ApiMenuCategory['id']
  filtersValues: FilterValues
}>()

const emit = defineEmits<{
  (e: 'goBackClick'): void
  (e: 'activateFilter', val: boolean): void
}>()

const menuStore = useMenuStore()
const filtersSafeCopy = computed(() => copy(props.filtersValues))

// function onGoBackClick() {
//   emit('goBackClick')
// }

function onClickFilter(val: boolean) {
  emit('activateFilter', val)
}

function onBooleanFilterChange(filterIndex: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value: boolean = target.checked

  const filters = filtersSafeCopy.value
  const filter = filters[filterIndex] as FilterValueBoolean

  filter.filterValue = value
  menuStore.applyFilters({
    categoryId: props.categoryId,
    filterValues: filters,
  })
}

function onSelectionFilterChange(filterIndex: number, values: string[] | undefined) {
  const filters = filtersSafeCopy.value
  const filter = filters[filterIndex] as FilterValueList

  filter.filterValues = values || []
  menuStore.applyFilters({
    categoryId: props.categoryId,
    filterValues: filters,
  })
}

function onSelectionFilterDateChange(
  filterIndex: number,
  filterValue: FilterValueDate,
) {
  const filters = filtersSafeCopy.value
  filters[filterIndex] = filterValue

  menuStore.applyFilters({
    categoryId: props.categoryId,
    filterValues: filters,
  })
}

function onSelectionFilterNumberRangeChange(
  filterIndex: number,
  filterValue: FilterValueNumberRange,
) {
  const filters = filtersSafeCopy.value
  filters[filterIndex] = filterValue

  menuStore.applyFilters({
    categoryId: props.categoryId,
    filterValues: filters,
  })
}

function onCheckboxFilterChange(filterIndex: number, val: string, checked: boolean) {
  const filters = filtersSafeCopy.value
  const filter = filters[filterIndex] as FilterValueList

  if (checked && !filter.filterValues.includes(val))
    filter.filterValues.push(val)
  else if (!checked)
    filter.filterValues = filter.filterValues.filter(k => k !== val)

  menuStore.applyFilters({
    categoryId: props.categoryId,
    filterValues: filters,
  })
}
</script>

<template>
  <div class="tw-basis-max tw-shrink tw-flex tw-flex-col tw-gap-4 tw-flex-1 tw-p-4">
    <template
      v-for="(filter, filterIndex) in filtersSafeCopy"
      :key="'property' in filter.def ? filter.def.property : filterIndex"
    >
      <div v-if="filter.type === 'boolean'">
        <label class="tw-block tw-mb-1 tw-text-zinc-800 tw-cursor-pointer">
          <input
            type="checkbox"
            class="tw-text-emerald-500 tw-rounded-full focus:tw-ring-0 focus:tw-ring-transparent"
            :name="filter.def.property"
            :checked="filter.filterValue"
            @change="onBooleanFilterChange(filterIndex, $event)"
          >
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
        </label>
      </div>
      <div v-else-if="filter.type === 'multiselection'">
        <label
          :for="filter.def.property"
          class="tw-block tw-mb-2 tw-text-zinc-500 tw-cursor-pointer"
        >
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
        </label>
        <SelectFilter
          :filter="filter"
          @change="onSelectionFilterChange(filterIndex, $event)"
          @click="onClickFilter(true)"
          @blur="onClickFilter(false)"
        />
      </div>
      <div v-else-if="filter.type === 'checkboxes_list'">
        <p class="tw-mb-2 tw-text-zinc-500">
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
        </p>
        <label
          v-for="value in filter.def.values"
          :key="value.value"
          class="tw-block tw-mb-1 tw-text-zinc-800 tw-cursor-pointer"
        >
          <input
            type="checkbox"
            class="tw-text-emerald-500 tw-rounded-full focus:tw-ring-0 focus:tw-ring-transparent"
            :name="`${filter.def.property}_${value.value}`"
            :checked="filter.filterValues.includes(value.value)"
            @change="
              (e) =>
                onCheckboxFilterChange(
                  filterIndex,
                  value.value,
                  //@ts-ignore
                  e.target.checked,
                )
            "
          >
          {{ (value.name && value.name.fr) || value.value }}
        </label>
      </div>
      <div v-else-if="filter.type === 'date_range'">
        <DateRange
          :filter="filter"
          @change="onSelectionFilterDateChange(filterIndex, $event)"
        />
      </div>
      <div v-else-if="filter.type === 'number_range'">
        <label class="tw-block tw-mb-1 tw-text-zinc-800 tw-cursor-pointer">
          {{ (filter.def.name && filter.def.name.fr) || filter.def.property }}
          <NumberRange
            :filter="filter"
            @change="onSelectionFilterNumberRangeChange(filterIndex, $event)"
          />
        </label>
      </div>
    </template>
  </div>
</template>
