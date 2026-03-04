<script lang="ts" setup>
import RoutesField from '~/components/Fields/RoutesField.vue'
import { PropertyTranslationsContextEnum } from '~/stores/site'
import type { ApiPoiPropertiesRouteLanguage } from '~/types/api/poi'

const defaultProps = {
  context: PropertyTranslationsContextEnum.Details,
  properties: {
    gpx_trace: 'https://cdt40.tourinsoft.com/upload/15.8.gpx',
    pdf: 'https://cdt40.tourinsoft.com/upload/ITIAQU040V502MFU.pdf',
    hiking: {
      difficulty: 'easy' as const,
      duration: 285,
      length: 10.2,
    },
    mtb: {
      difficulty: 'easy' as const,
      duration: 90,
      length: 10.2,
    },
  } as ApiPoiPropertiesRouteLanguage,
}

const props = {
  Default: {
    ...defaultProps,
  },
  MissingFields: {
    ...defaultProps,
    properties: {
      hiking: {
        length: 0,
      },
    } as ApiPoiPropertiesRouteLanguage,
  },
  MissingDuration: {
    ...defaultProps,
    properties: {
      hiking: {
        difficulty: 'easy' as const,
        length: 10.2,
      },
    } as ApiPoiPropertiesRouteLanguage,
  },
}
</script>

<template>
  <Story title="Fields/Route">
    <div v-for="(p, name) in props" :key="name">
      <div
        v-for="id in [
          PropertyTranslationsContextEnum.Card,
          PropertyTranslationsContextEnum.Details,
        ]"
        :key="id"
      >
        <Variant :title="`${name.replace(/([A-Z])/g, ' $1').trim()} - ${id}`">
          <RoutesField v-bind="p" :context="id" />
        </Variant>
      </div>
    </div>
  </Story>
</template>
