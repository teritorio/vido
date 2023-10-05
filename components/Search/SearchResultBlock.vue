<template>
  <div class="tw-mb-3">
    <h4 class="tw-text-zinc-500 tw-text-sm tw-mb-2">
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
        <teritorio-icon
          v-if="item.icon && item.icon.indexOf('teritorio') != -1"
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
          <span v-if="item.small" class="tw-text-zinc-400 tw-text-sm"
            >({{ item.small }})</span
          >
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { SearchResult } from '~/lib/apiSearch'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    TeritorioIcon,
  },

  props: {
    label: {
      type: String as PropType<string>,
      required: true,
    },
    type: {
      type: String as PropType<'cartocode' | 'category' | 'pois' | 'addresse'>,
      required: true,
    },
    items: {
      type: Array as PropType<SearchResult[]>,
      required: true,
    },
    icon: {
      type: String as PropType<string>,
      default: null,
    },
  },

  emits: {
    'item-click': (_searchResult: SearchResult) => true,
  },

  methods: {
    onItemClick(searchResult: SearchResult) {
      this.$tracking({
        type: 'search_result_event',
        event: 'select',
        resultType: this.type,
        title: searchResult.label,
      })
      this.$emit('item-click', searchResult)
    },
  },
})
</script>
