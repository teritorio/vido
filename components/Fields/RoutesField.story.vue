<script lang="ts" setup>
import RoutesField from '~/components/Fields/RoutesField.vue'
import { PropertyTranslationsContextEnum } from '~/stores/site'
import type { ApiPoiPropertiesRoute } from '~/types/api/poi'

const defaultProps = {
  context: PropertyTranslationsContextEnum.Details,
  properties: {
    'fr-FR': {
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
    },
  } as ApiPoiPropertiesRoute,
}

const props = {
  Default: {
    ...defaultProps,
  },
  MissingFields: {
    ...defaultProps,
    properties: {
      'fr-FR': {
        hiking: {
          difficulty: 'easy' as const,
          duration: 0,
          length: 0,
        },
      },
    } as ApiPoiPropertiesRoute,
  },
  MissingDifficulty: {
    ...defaultProps,
    properties: {
      'fr-FR': {
        hiking: {
          difficulty: 'easy' as const,
          duration: 285,
          length: 10.2,
        },
      },
    } as ApiPoiPropertiesRoute,
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
