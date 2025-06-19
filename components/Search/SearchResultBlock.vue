<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import type { SearchResult } from '~/lib/apiSearch'

const props = defineProps<{
  label: string
  type: 'cartocode' | 'category' | 'pois' | 'addresse'
  items: SearchResult[]
  icon: string
}>()

const emit = defineEmits<{
  (e: 'itemClick', searchResult: SearchResult): void
}>()

const { $tracking } = useNuxtApp()

function onItemClick(searchResult: SearchResult): void {
  $tracking({
    type: 'search_result_event',
    event: 'select',
    resultType: props.type,
    title: searchResult.label,
  })
  emit('itemClick', searchResult)
}
</script>

<template>
  <div class="tw-mb-3">
    <h4 class="tw-text-zinc-500 tw-text-md tw-mb-2">
      <FontAwesomeIcon v-if="icon" :icon="icon" />
      {{ label }}
    </h4>
    <ul>
      <li
        v-for="item in items"
        :key="`${item.id}-${item.filter_property}-${item.filter_value}`"
        class="tw-flex tw-flex-row tw-items-baseline tw-justify-start tw-gap-x-1 tw-mb-1 hover:tw-bg-zinc-100 tw-cursor-pointer tw-rounded-xl tw-ml-2 tw-px-2"
        :data-item="item.id"
        @click="onItemClick(item)"
      >
        <TeritorioIcon
          v-if="item.icon && item.icon.indexOf('teritorio') !== -1"
          :picto="item.icon"
          color-text="#6B7280"
        />
        <FontAwesomeIcon
          v-else-if="item.icon"
          :icon="item.icon"
          color="#6B7280"
          size="sm"
        />
        <span>
          {{ item.label }}
          <span v-if="item.small" class="tw-text-zinc-400 tw-text-sm">({{ item.small }})</span>
        </span>
      </li>
    </ul>
  </div>
</template>
