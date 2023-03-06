<template>
  <div class="mb-3">
    <h4 class="text-zinc-500 text-sm mb-2">
      <font-awesome-icon v-if="icon" :icon="icon" />
      {{ label }}
    </h4>
    <ul>
      <li
        v-for="item in items"
        :key="`${item.id}-${item.filter_property}-${item.filter_value}`"
        class="flex flex-row items-baseline justify-start gap-x-1 mb-1 hover:bg-zinc-100 cursor-pointer rounded-xl ml-2 px-2"
        :data-item="item.id"
        @click="onItemClick(item)"
      >
        <teritorio-icon
          v-if="item.icon && item.icon.indexOf('teritorio') != -1"
          :picto="item.icon"
          color-text="#6B7280"
        />
        <font-awesome-icon
          v-else-if="item.icon"
          :icon="item.icon"
          color="#6B7280"
          size="sm"
        />
        <span>
          {{ item.label }}
          <span v-if="item.small" class="text-zinc-400 text-sm"
            >({{ item.small }})</span
          >
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { SearchResult } from '~/lib/apiSearch'

export default Vue.extend({
  components: {
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

  methods: {
    onItemClick(searchResult: SearchResult) {
      this.$tracking({
        type: 'search_result_event',
        event: 'select',
        resultType: this.type,
        title: searchResult.label,
      })
      this.$emit(
        'item-click',
        this.type === 'category' ? searchResult : searchResult.id
      )
    },
  },
})
</script>
