<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Settings } from '~/lib/apiSettings'
import { useSiteStore } from '~/stores/site'

const { detectHost } = useHostDetection()

const { data: context } = await useFetch('/api/config', {
  headers: {
    'x-client-host': detectHost(),
  },
})

const { settings } = storeToRefs(useSiteStore())
const apiEndpoint = useState('api-endpoint', () => context.value?.api)

if (apiEndpoint.value) {
  const { data, status } = await useAsyncData('error-layout-settings', async () => $fetch<Settings>(`${apiEndpoint.value}/settings.json`))

  if (status.value === 'success' && data.value) {
    settings.value = Object.assign(
      {
        id: 0,
        slug: '',
        name: '',
        attribution: [],
        icon_font_css_url: '',
        bbox_line: {
          type: 'LineString',
          coordinates: [
            [1.43862, 42.41845],
            [1.68279, 42.6775],
          ],
        },
        themes: {},
      },
      data.value,
    )
  }
}
</script>

<template>
  <div class="v-locale--is-ltr">
    <slot />
  </div>
</template>
