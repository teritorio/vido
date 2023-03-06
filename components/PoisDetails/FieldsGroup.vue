<template>
  <div v-if="group.fields && !empty">
    <div v-if="group.display_mode === 'standard'">
      <FieldsHeader :recursion-stack="recursionStack">
        {{ title }}
      </FieldsHeader>
      <Fields
        :recursion-stack="[...recursionStack, group.group]"
        :fields="group.fields"
        :properties="properties"
        :geom="geom"
        :color-fill="colorFill"
      />
    </div>
    <Block
      v-else-if="group.display_mode === 'card'"
      :color-fill="colorFill"
      :icon="group.icon"
    >
      <FieldsHeader :recursion-stack="recursionStack">
        {{ title }}
      </FieldsHeader>
      <Fields
        :recursion-stack="[...recursionStack, group.group]"
        :fields="group.fields"
        :properties="properties"
        :geom="geom"
        :color-fill="colorFill"
      />
    </Block>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor, PropType } from 'vue'

import { isFiledEmpty } from '../Fields/Field.vue'

import Block from '~/components/PoisDetails/Block.vue'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import {
  ApiPoiProperties,
  FieldsList,
  FieldsListGroup,
  FieldsListItem,
} from '~/lib/apiPois'
// import Fields from '~/components/PoisDetails/Fields.vue'

export function isListEmpty(
  fileds: FieldsList,
  properties: { [key: string]: string },
  geom: GeoJSON.Geometry
): boolean {
  return fileds.reduce(
    (sum: boolean, value: FieldsListItem | FieldsListGroup) =>
      sum &&
      ('group' in value
        ? isListEmpty(value.fields, properties, geom)
        : isFiledEmpty(value, properties, geom)),
    true
  )
}

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
    recursionStack: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    group: {
      type: Object as PropType<FieldsListGroup>,
      required: true,
    },
    title: {
      type: String as PropType<string>,
      required: true,
    },
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
    colorFill: {
      type: String as PropType<string>,
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

  created() {
    this.empty = isListEmpty(this.group.fields, this.properties, this.geom)
  },
})
</script>
