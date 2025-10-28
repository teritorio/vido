<script setup lang="ts">
import type { Settings } from '~/lib/apiSettings'

const { data: projects, error } = await useFetch<Record<string, Settings>>('/api/projects')

const themeColors = {
  tourism: 'green-darken-3',
  city: 'yellow-darken-3',
  care: 'red-darken-3',
  logistic: 'blue-darken-3',
  alimentation: 'lime-darken-3',
  bpe: 'indigo-darken-3',
  carte: 'blue-grey-darken-3',
} as { [key: string]: string }
</script>

<template>
  <p v-if="error">
    {{ error }}
  </p>
  <VContainer v-else fluid>
    <VRow>
      <VCol
        v-for="project in projects"
        :key="project.slug"
        cols="12"
        sm="6"
        md="4"
      >
        <VCard class="h-100">
          <VCardItem :style="{ backgroundColor: '#082e4e', color: '#FFFFFF' }">
            <VCardTitle>
              <VChip variant="outlined">
                {{ project.slug }}
              </VChip>
              {{ project.name }}
            </VCardTitle>
          </VCardItem>

          <VDivider thickness="3" />

          <VCardText class="bg-surface-light pt-4">
            <VRow v-if="project.themes && Object.keys(project.themes).length">
              <VCol
                v-for="theme in Object.values(project.themes)"
                :key="theme.slug"
                cols="12"
                sm="6"
              >
                <VCard :href="theme.site_url.fr">
                  <VImg
                    aspect-ratio="1/1"
                    height="80px"
                    contain
                    class="mt-2"
                    :src="theme.favicon_url"
                  >
                    <template #error>
                      <VImg
                        aspect-ratio="1/1"
                        height="80px"
                        contain
                        src="https://user-images.githubusercontent.com/47315479/81145216-7fbd8700-8f7e-11ea-9d49-bd5fb4a888f1.png"
                      />
                    </template>
                  </VImg>

                  <VCardTitle class="text-body-2 pa-2">
                    <VChip :color="themeColors[theme.slug]" size="small">
                      {{ theme.slug }}
                    </VChip>
                    {{ theme.title.fr }}
                  </VCardTitle>

                  <VCardText class="pa-2">
                    <VList :lines="false" density="compact">
                      <VListItem>
                        Explorer Mode: {{ theme.explorer_mode ? '✅' : '❌' }}
                      </VListItem>
                      <VListItem>
                        Favorites Mode: {{ theme.favorites_mode ? '✅' : '❌' }}
                      </VListItem>
                      <VListItem>
                        Isochrone: {{ theme.isochrone ? '✅' : '❌' }}
                      </VListItem>
                      <VListItem>
                        GTM ID: {{ theme.google_tag_manager_id || '❌' }}
                      </VListItem>
                      <VListItem>
                        Matomo ID: {{ theme.matomo_siteid || '❌' }}
                      </VListItem>
                      <VListItem>
                        Cookie Consent: {{ theme.cookies_consent_message ? '✅' : '❌' }}
                      </VListItem>
                    </VList>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
            <p v-else class="text-caption text-medium-emphasis">
              No themes configured
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
