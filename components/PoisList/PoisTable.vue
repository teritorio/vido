<template>
  <table>
    <thead>
      <tr class="bg-gray-100">
        <th v-for="header in headers" :key="header.value" scope="col">
          {{ header.text }}
        </th>
      </tr>
    </thead>
    <tbody v-if="pois.features">
      <tr v-for="(feature, i) in pois.features" :key="i">
        <td v-for="field in fields" :key="field.field" class="align-top">
          <Field
            :context="context"
            :recursion-stack="[field.field]"
            :field="field"
            :details="$t('poisTable.details')"
            :properties="feature.properties"
            :geom="feature.geometry"
          />
        </td>
        <td class="align-top">
          <NuxtLink :to="`/poi/${feature.properties.metadata.id}/details`">
            {{ $t('poisTable.details') }}
          </NuxtLink>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr class="text-center">
        <td :colspan="headers.length">
          {{ $t('poisTable.empty') }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Field from '~/components/Fields/Field.vue'
import { ApiPois, FieldsListItem } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default Vue.extend({
  components: {
    Field,
  },

  props: {
    fields: {
      type: Array as PropType<FieldsListItem[]>,
      required: true,
    },
    pois: {
      type: Object as PropType<ApiPois>,
      required: true,
    },
  },

  computed: {
    headers(): { value: String; text: String }[] {
      const h = this.fields.map((field) => ({
        value: field.field,
        text: this.$propertyTranslations.p(
          field.field,
          PropertyTranslationsContextEnum.List
        ),
      }))
      h.push({ value: '', text: '' })
      return h
    },

    context(): PropertyTranslationsContextEnum {
      return PropertyTranslationsContextEnum.List
    },
  },
})
</script>