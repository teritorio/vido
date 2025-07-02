<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import { VTextField } from 'vuetify/lib/components/index.mjs'
import { useSearchStore } from '~/stores/search'

const searchStore = useSearchStore()
const { searchText, isLoading } = storeToRefs(searchStore)
const { $tracking } = useNuxtApp()
const device = useDevice()

function onFocus(state: boolean) {
  if (state)
    $tracking({ type: 'search' })
  else
    setTimeout(() => searchStore.closeSearch(), 300)
}
</script>

<template>
  <VTextField
    v-model="searchText"
    :placeholder="$t('headerMenu.searchHint')"
    :persistent-clear="true"
    :autofocus="device.smallScreen"
    :bg-color="device.smallScreen ? '#FFFFFF' : '#F4F4F5'"
    persistent-placeholder
    rounded
    clearable
    variant="solo"
    hide-details
    glow
    density="comfortable"
    flat
    @update:model-value="searchStore.submit"
    @update:focused="onFocus"
    @click:control="searchStore.openSearch"
    @click:clear="searchStore.reset"
  >
    <template #label>
      <span class="d-sr-only">{{ $t('headerMenu.searchHint') }}</span>
    </template>
    <template #prepend-inner>
      <FontAwesomeIcon icon="search" />
    </template>
    <template #append-inner>
      <FontAwesomeIcon v-if="isLoading" icon="spinner" class="tw-animate-spin" />
    </template>
  </VTextField>
</template>

<style lang="css" scoped>
:deep(.v-field__input:focus) {
  box-shadow: none;
}

:deep(.v-field__clearable) {
  grid-column: 4;
}

:deep(.v-field__append-inner) {
  grid-column: 3;
}
</style>
