<script lang="ts">
import type { PropType } from 'vue'
import { defineNuxtComponent } from '#app'
import Field from '~/components/Fields/Field.vue'
import type { ApiPois, FieldsListItem } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'

export default defineNuxtComponent({
  components: {
    ContribFieldGroup,
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
  data() {
    const { contribMode, isContribEligible, getContributorFields } = useContrib()
    return {
      contribMode,
      isContribEligible,
      getContributorFields,
    }
  },
  computed: {
    headers(): { value: string, text: string }[] {
      const h = this.fields.map(field => ({
        value: field.field,
        text: this.$propertyTranslations.p(
          field.field,
          PropertyTranslationsContextEnum.List,
        ),
      }))
      h.push({ value: '', text: '' })
      if (this.contribMode)
        h.push({ value: '', text: this.$t('fields.contrib.heading') })

      return h
    },
    context(): PropertyTranslationsContextEnum {
      return PropertyTranslationsContextEnum.List
    },
  },
})
</script>

<template>
  <table>
    <thead>
      <tr class="tw-bg-gray-100">
        <th v-for="header in headers" :key="header.value" scope="col">
          {{ header.text }}
        </th>
      </tr>
    </thead>
    <tbody v-if="pois.features">
      <tr v-for="(feature, i) in pois.features" :key="i">
        <td v-for="field in fields" :key="field.field" class="tw-align-top">
          <Field
            :context="context"
            :recursion-stack="[field.field]"
            :field="field"
            :details="$t('poisTable.details')"
            :properties="feature.properties"
            :geom="feature.geometry"
          />
        </td>
        <td class="tw-align-top">
          <NuxtLink :to="`/poi/${feature.properties.metadata.id}/details`">
            {{ $t('poisTable.details') }}
          </NuxtLink>
        </td>
        <td v-if="contribMode && isContribEligible(feature.properties)" class="tw-align-top">
          <ContribFieldGroup v-bind="getContributorFields(feature)" />
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr class="tw-text-center">
        <td :colspan="headers.length">
          {{ $t('poisTable.empty') }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
