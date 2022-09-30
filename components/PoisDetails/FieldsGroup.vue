<template>
  <div v-if="group.fields && group.display_mode === 'standard'">
    <FieldsHeader :recursion-level="recursionLevel">
      {{ title }}
    </FieldsHeader>
    <Fields
      :recursion-level="recursionLevel + 1"
      :fields="group.fields"
      :properties="properties"
      :color-fill="colorFill"
    />
  </div>
  <Block
    v-else-if="group.fields && group.display_mode === 'card'"
    :color-fill="colorFill"
    :icon="group.icon"
  >
    <FieldsHeader :recursion-level="recursionLevel">
      {{ title }}
    </FieldsHeader>
    <Fields
      :recursion-level="recursionLevel + 1"
      :fields="group.fields"
      :properties="properties"
      :color-fill="colorFill"
    />
  </Block>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Block from '~/components/PoisDetails/Block.vue'
import FieldsHeader from '~/components/PoisDetails/FieldsHeader.vue'
import { ApiPoiProperties, FieldsListGroup } from '~/lib/apiPois'
// import Fields from '~/components/PoisDetails/Fields.vue'

export default Vue.extend({
  components: {
    Block,
    FieldsHeader,
    // Fields,
  },

  props: {
    recursionLevel: {
      type: Number,
      default: 0,
    },
    group: {
      type: Object as PropType<FieldsListGroup>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    colorFill: {
      type: String,
      required: true,
    },
  },

  beforeCreate: function () {
    // Break circular components dependcy
    // @ts-ignore
    this.$options.components.Fields =
      require('~/components/PoisDetails/Fields.vue').default
  },
})
</script>
