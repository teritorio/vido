<script lang="ts">
import type { PropType } from 'vue'

import { VDataTable } from 'vuetify/labs/VDataTable'
import Field from '~/components/Fields/Field.vue'
import type { ApiPois, FieldsListItem } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default {
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
    context(): PropertyTranslationsContextEnum {
      return PropertyTranslationsContextEnum.List
    },
    headers(): Array<{ title: string, value?: string, key?: string }> {
      const headers = this.fields.map(f => ({
        title: this.$propertyTranslations.p(
          f.field,
          PropertyTranslationsContextEnum.List,
        ),
        value: f.field,
        key: `properties.${f.field}`,
      }))
      headers.push({ title: '', value: '', key: '' })
      return headers
    },
  },
}
</script>

<template>
  <v-data-table class="mt-4" :headers="headers" :items="pois.features" item-key="name" items-per-page="5" :no-data-text="$t('poisTable.empty')">
    <template #item="{ item }">
      <tr>
        <td v-for="field in fields" :key="field.field" class="tw-align-top">
          <Field
            :context="context"
            :recursion-stack="[field.field]"
            :field="field"
            :details="$t('poisTable.details')"
            :properties="item.selectable.properties"
            :geom="item.selectable.geometry"
          />
        </td>
        <td>
          <NuxtLink :to="`/poi/${item.selectable.properties.metadata.id}/details`">
            {{ $t('poisTable.details') }}
          </NuxtLink>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<style scoped lang="scss">
/* stylelint-disable selector-class-pattern */
.v-data-table .v-table__wrapper > table thead {
  background: blue
}

.v-data-table .v-table__wrapper > table tbody > tr:nth-child(even) > td {
  background: #F3F4F6;
}
</style>
