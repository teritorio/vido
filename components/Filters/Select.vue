<script setup lang="ts">
import { VAutocomplete } from 'vuetify/components/VAutocomplete'
import type { FilterValueList } from '~/utils/types-filters'

const props = defineProps<{
  filter: FilterValueList
}>()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'blur'): void
  (e: 'change', value?: string[]): void
}>()

const { locale, t } = useI18n()
const currentValue = ref(props.filter.filterValues)

const items = computed((): { title: string, value: string }[] => {
  return props.filter.def.values.map(value => ({
    title: (value.name && value.name.fr) || value.value,
    value: value.value,
  })).sort((a, b) => a.title.localeCompare(b.title, locale.value, { sensitivity: 'base' }))
})

watch(() => props.filter, (newValue) => {
  if (newValue)
    currentValue.value = newValue.filterValues
})

function normalize(str: string): string {
  return str
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function filterEasy(value: string, query: string) {
  if (value == null || query == null)
    return -1

  return normalize(value).indexOf(normalize(query))
}

function onChange(value: string[] | undefined) {
  emit('change', value)
}
</script>

<template>
  <div>
    <VAutocomplete
      v-model="currentValue"
      outlined
      multiple
      chips
      deletable-chips
      :items="items"
      :label="t('listFilter.label')"
      :clearable="true"
      hide-details="auto"
      density="compact"
      :custom-filter="filterEasy"
      @update:model-value="onChange"
      @click="$emit('click')"
      @blur="$emit('blur')"
    />
  </div>
</template>
