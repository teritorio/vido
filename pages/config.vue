<script setup lang="ts">
import configData from '@/vidos-config.json'

definePageMeta({ layout: 'config' })

useHead({ title: 'Vido - Available Instances' })

const selectedTheme = ref<string>('tourism')
const searchQuery = ref('')
const instanceSettings = ref<Record<string, any>>({})
const loadingSettings = ref<Record<string, boolean>>({})

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

function formatTitle(theme: string, project: string) {
  return `${capitalize(theme)} – ${capitalize(project.replace(/_/g, ' '))}`
}

function groupConfigsByTheme(configs: Record<string, any>) {
  return Object.entries(configs).reduce((groups, [hostname, config]) => {
    const theme = config.API_THEME || 'Unknown'
    if (!groups[theme])
      groups[theme] = {}
    groups[theme][hostname] = config
    return groups
  }, {} as Record<string, Record<string, any>>)
}

const groupedConfigs = computed(() => groupConfigsByTheme(configData))

const filteredConfigs = computed(() => {
  const lowerQuery = searchQuery.value.toLowerCase()
  return Object.entries(groupedConfigs.value).reduce((acc, [theme, instances]) => {
    if (selectedTheme.value !== theme && selectedTheme.value !== 'All')
      return acc

    const filteredInstances = Object.entries(instances).filter(
      ([_hostname, config]) =>
        config.API_PROJECT.toLowerCase().includes(lowerQuery),
    )

    if (filteredInstances.length)
      acc[theme] = Object.fromEntries(filteredInstances)

    return acc
  }, {} as Record<string, Record<string, any>>)
})

async function fetchSettings(hostname: string, config: any) {
  if (instanceSettings.value[hostname])
    return

  loadingSettings.value[hostname] = true
  const { API_ENDPOINT, API_PROJECT, API_THEME } = config
  const url = `${API_ENDPOINT}/${API_PROJECT}/${API_THEME}/settings.json`

  try {
    const response = await fetch(url)
    const data = await response.json()
    instanceSettings.value[hostname] = data
  }
  catch (error) {
    console.error(`Failed to fetch settings for ${hostname}:`, error)
  }
  finally {
    loadingSettings.value[hostname] = false
  }
}

// Initialize settings fetching
Object.entries(configData).forEach(([hostname, config]) =>
  fetchSettings(hostname, config),
)

function openInstance(hostname: string) {
  window.open(`http://${hostname}:3000`, '_blank')
}

function toggleTheme(theme: string) {
  selectedTheme.value = theme
}
</script>

<template>
  <div class="container">
    <h1 class="title">
      Available Config Instances
    </h1>

    <!-- Filter section -->
    <div class="filter-section">
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Project"
          class="search-input"
        >
      </div>

      <div class="tags">
        <span
          v-for="(instances, theme) in groupedConfigs"
          :key="theme"
          class="tag"
          :class="{ selected: selectedTheme === theme }"
          @click="toggleTheme(theme)"
        >
          {{ theme }}
        </span>
      </div>
    </div>

    <!-- Display instances -->
    <div
      v-for="(instances, theme) in filteredConfigs"
      :key="theme"
      class="theme-section"
    >
      <div class="grid">
        <div
          v-for="(config, hostname) in instances"
          :key="hostname"
          class="card"
          @click="openInstance(hostname)"
        >
          <div class="card-header">
            <template v-if="loadingSettings[hostname]">
              <div class="skeleton-logo" />
              <div class="skeleton-title" />
              <div class="skeleton-description" />
            </template>

            <template v-else>
              <img
                v-if="instanceSettings[hostname]?.themes?.[0]?.logo_url"
                :src="instanceSettings[hostname].themes[0].logo_url"
                alt="Logo"
                class="logo"
              >
              <div v-else class="skeleton-logo" />

              <h2 class="card-title">
                {{
                  instanceSettings[hostname]?.name
                    || formatTitle(config.API_THEME, config.API_PROJECT)
                }}
              </h2>

              <p class="card-description">
                {{
                  instanceSettings[hostname]?.themes?.[0]?.description?.[
                    instanceSettings[hostname]?.default_country
                  ]
                }}
              </p>
            </template>
          </div>

          <div class="card-body">
            <p><strong>Hosts:</strong> {{ config.HOSTS?.join(', ') }}</p>
            <p><strong>Isochrone:</strong> {{ config.ISOCHRONE ? '✅' : '❌' }}</p>
            <p><strong>Image Proxy:</strong> {{ config.IMAGE_PROXY ? '✅' : '❌' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #222;
}

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0 0 0 / 10%);
}

.search-container {
  text-align: center;
  margin-bottom: 1.5rem;
  width: 100%;
}

.search-input {
  padding: 0.75rem;
  width: 100%;
  max-width: 500px;
  font-size: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #3b82f6;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 0;
}

.tag {
  background-color: #e5e7eb;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.tag.selected {
  background-color: #3b82f6;
  color: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0 0 0 / 10%);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0 0 0 / 15%);
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.card-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.card-body p {
  font-size: 0.9rem;
  margin: 0.35rem 0;
  color: #374151;
}

.card-footer {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #3b82f6;
  font-weight: 500;
  text-align: right;
}

.skeleton-logo {
  width: 64px;
  height: 64px;
  background-color: #e5e7eb;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.skeleton-title,
.skeleton-description {
  height: 16px;
  background-color: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-title {
  width: 70%;
}

.skeleton-description {
  width: 60%;
}

.logo {
  max-height: 40px;
  margin-bottom: 0.5rem;
}
</style>
