<template>
  <Block
    v-if="p.website || p.phone || p.email"
    :color-fill="colorFill"
    icon="phone"
  >
    <h2>{{ $tc('details.headerContacts') }}</h2>
    <p
      v-for="phone in (p.phone || []).concat(p.mobile || [])"
      :key="phone"
      class="item"
    >
      <Phone :number="phone" />
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

import Block from '~/components/Details/Block.vue'
import Phone from '~/components/Fields/Phone.vue'
import { ApiPoiProperties } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    Block,
    Phone,
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
