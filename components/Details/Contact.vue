<template>
  <Block
    v-if="p.website || p.phone || p.email"
    :color-fill="colorFill"
    icon="phone"
  >
    <h2>{{ $tc('details.headerContacts') }}</h2>
    <p v-for="phone in p.phone || []" :key="phone" class="item">
      <a v-if="$screen.phone" :href="`tel:${phone}`">
        {{ phone }}
      </a>
      <template v-else>
        {{ phone }}
      </template>
    </p>
    <p v-for="email in p.email || []" :key="email" class="item">
      <a :href="`mailto:${email}`">
        {{ email }}
      </a>
    </p>
    <p v-for="website in p.website || []" :key="website" class="item">
      <a :href="p.website" target="_blank">
        {{ website }}
      </a>
    </p>
  </Block>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Block from '@/components/Details/Block.vue'
import { ApiPoiProperties } from '@/lib/apiPois'

export default Vue.extend({
  components: {
    Block,
  },

  props: {
    p: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    colorFill: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="css" scoped>
.item {
  font-size: 1rem;
  margin-bottom: 0.27rem;
}
</style>
