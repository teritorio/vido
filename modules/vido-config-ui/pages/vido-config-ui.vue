<script setup lang="ts">
import configData from '@/vidos-config.json'

definePageMeta({ layout: 'vido-config-ui' })

const selectedTheme = ref('tourism')
const searchQuery = ref('')

const groupedConfigs = computed(() => {
  const groups: Record<string, Record<string, any>> = {}
  for (const [hostname, config] of Object.entries(configData)) {
    const theme = config.API_THEME || 'Unknown'
    if (!groups[theme])
      groups[theme] = {}
    groups[theme][hostname] = config
  }
  return groups
})

const filteredConfigs = computed(() => {
  const filtered: Record<string, Record<string, any>> = {}
  for (const [theme, instances] of Object.entries(groupedConfigs.value)) {
    if (selectedTheme.value !== theme && selectedTheme.value !== 'All')
      continue

    const filteredInstances = Object.entries(instances).filter(([_, config]) =>
      config.API_PROJECT.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )

    if (filteredInstances.length) {
      filtered[theme] = Object.fromEntries(filteredInstances)
    }
  }
  return filtered
})

const instanceSettings = ref({})
const loadingSettings = ref({})

for (const [hostname, config] of Object.entries(configData)) {
  fetchSettings(hostname, config)
}

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

function toggleTheme(theme: string) {
  selectedTheme.value = theme
}
</script>

<template>
  <div class="container">
    <h1 class="title">
      Available Config Instances
    </h1>

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

    <div v-for="(instances, theme) in filteredConfigs" :key="theme" class="theme-section">
      <div class="grid">
        <VidoConfigInstanceCard
          v-for="(config, hostname) in instances"
          :key="hostname"
          :hostname="hostname"
          :config="config"
          :instance-settings="instanceSettings"
          :loading="loadingSettings[hostname]"
        />
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
</style>
