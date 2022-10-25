<template>
  <div v-if="group.fields">
    <Fields
      v-show="false"
      ref="fields"
      :recursion-level="recursionLevel + 1"
      :fields="group.fields"
      :properties="properties"
      :color-fill="colorFill"
    />

    <div v-if="!empty && group.display_mode === 'standard'">
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
      v-else-if="!empty && group.display_mode === 'card'"
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
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor, PropType } from 'vue'

import Block from '~/components/PoisDetails/Block.vue'
import FieldsHeader from '~/components/PoisDetails/FieldsHeader.vue'
import { ApiPoiProperties, FieldsListGroup } from '~/lib/apiPois'
// import Fields from '~/components/PoisDetails/Fields.vue'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        fields: InstanceType<typeof Vue>
      }
    }
  >
).extend({
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

  data(): {
    empty: any
  } {
    return {
      empty: true,
    }
  },

  beforeCreate() {
    // Break circular components dependcy
    // @ts-ignore
    this.$options.components.Fields =
      require('~/components/PoisDetails/Fields.vue').default
  },

  mounted() {
    // Pre-render Fields with show=false. Then check for content before real rendering
    this.empty = this.$refs.fields.$el.children.length === 0
  },
})
</script>
