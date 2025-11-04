<script setup lang="ts">
import { VCardSubtitle } from 'vuetify/lib/components/index.mjs'
import type { Settings } from '~/lib/apiSettings'

definePageMeta({
  layout: 'projects',
})

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

const searchQuery = ref('')
const selectedTheme = ref('all')
const { appHost } = useRuntimeConfig().public

const availableThemes = computed(() => {
  const themes = new Set<string>()
  if (projects.value) {
    Object.values(projects.value).forEach((project) => {
      if (project.themes) {
        Object.values(project.themes).forEach((theme) => {
          themes.add(theme.slug)
        })
      }
    })
  }
  return [
    { title: 'All themes', value: 'all' },
    ...Array.from(themes).sort().map(theme => ({
      title: theme,
      value: theme,
    })),
  ]
})

const filteredProjects = computed(() => {
  if (!projects.value)
    return {}

  return Object.fromEntries(
    Object.entries(projects.value).filter(([_, project]) => {
      const matchesSearch = !searchQuery.value
        ? true
        : project.name?.toLowerCase().includes(searchQuery.value?.toLowerCase())
        || project.slug?.toLowerCase().includes(searchQuery.value?.toLowerCase())

      const matchesTheme = selectedTheme.value === 'all'
        || (project.themes && Object.values(project.themes).some(theme =>
          theme.slug === selectedTheme.value,
        ))

      return matchesSearch && matchesTheme
    }),
  )
})
</script>

<template>
  <p v-if="error">
    {{ error }}
  </p>

  <VContainer v-else fluid>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="text-h4">
            Cartoguide instances
          </VCardTitle>

          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="searchQuery"
                  label="Search by project name"
                  placeholder="Type to search..."
                  clearable
                  density="comfortable"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12" md="6">
                <VSelect
                  v-model="selectedTheme"
                  :items="availableThemes"
                  label="Filter by theme"
                  density="comfortable"
                  variant="outlined"
                >
                  <template #item="{ item, props }">
                    <VListItem v-bind="props">
                      <template #prepend>
                        <VBadge
                          v-if="item.value !== 'all'"
                          :color="themeColors[item.value]"
                          dot
                          inline
                        />
                      </template>
                    </VListItem>
                  </template>

                  <template #selection="{ item }">
                    <span v-if="item.value === 'all'">All themes</span>
                    <span v-else class="d-flex align-center">
                      <VBadge
                        dot
                        inline
                        class="mr-2"
                        :color="themeColors[item.value]"
                      />
                      {{ item.value }}
                    </span>
                  </template>
                </VSelect>
              </VCol>
            </VRow>
          </VCardText>

          <!-- Results count -->
          <VAlert
            v-if="searchQuery || selectedTheme !== 'all'"
            color="info"
            variant="tonal"
            density="compact"
            class="mt-2"
          >
            Showing {{ Object.keys(filteredProjects).length }} of {{ Object.keys(projects || {}).length }} projects
          </VAlert>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol
        v-for="project in filteredProjects"
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
                <VCard>
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

                  <VCardItem>
                    <VCardTitle class="text-body-2 pa-2">
                      <VChip :color="themeColors[theme.slug]" size="small">
                        {{ theme.slug }}
                      </VChip>
                      {{ theme.title.fr }}
                    </VCardTitle>
                    <VCardSubtitle
                      :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'visible',
                        textOverflow: 'unset',
                        whiteSpace: 'unset',
                      }"
                    >
                      <a :href="theme.site_url.fr" target="_blank">PROD: {{ theme.site_url.fr }}</a>
                      <a :href="`https://${theme.slug}-${project.slug}.${appHost}`" target="_blank">DEV: {{ `https://${theme.slug}-${project.slug}.${appHost}` }}</a>
                    </VCardSubtitle>
                  </VCardItem>

                  <VCardText class="pa-2">
                    <VList :lines="false" density="compact">
                      <VListItem>
                        Explorer Mode: {{ theme.explorer_mode === false ? '❌' : '✅' }}
                      </VListItem>
                      <VListItem>
                        Favorites Mode: {{ theme.favorites_mode === false ? '❌' : '✅' }}
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

      <VCol v-if="!Object.keys(filteredProjects).length" cols="12">
        <VAlert
          type="info"
          variant="tonal"
          class="text-center"
        >
          <VAlertTitle>No projects found</VAlertTitle>
          Try adjusting your search or filter criteria
        </VAlert>
      </VCol>
    </VRow>
  </VContainer>
</template>
