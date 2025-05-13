<script setup lang="ts">
const props = defineProps({
  hostname: String,
  config: Object,
  loading: Boolean,
  instanceSettings: Object,
})

function openInstance(hostname: string) {
  window.open(`http://${hostname}:3000`, '_blank')
}

const logoUrl = computed(() => props.instanceSettings[props.hostname]?.themes?.[0]?.logo_url)
const formattedTitle = computed(() => {
  const { API_THEME, API_PROJECT } = props.config
  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
  return `${capitalize(API_THEME)} – ${capitalize(API_PROJECT.replace(/_/g, ' '))}`
})
const description = computed(() => props.instanceSettings[props.hostname]?.themes?.[0]?.description[props.instanceSettings[props.hostname]?.default_country])
const hosts = computed(() => props.config.HOSTS?.join(', '))
const isIsochrone = computed(() => props.config.ISOCHRONE)
const isImageProxy = computed(() => props.config.IMAGE_PROXY)
</script>

<template>
  <div class="card" @click="openInstance(hostname)">
    <div class="card-header">
      <InstanceCardSkeleton v-if="loading" />
      <template v-else>
        <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="logo">
        <div v-else class="skeleton-logo" />
        <h2 class="card-title">
          {{ formattedTitle }}
        </h2>
        <p class="card-description">
          {{ description }}
        </p>
      </template>
    </div>

    <div class="card-body">
      <p><strong>Hosts:</strong> {{ hosts }}</p>
      <p><strong>Isochrone:</strong> {{ isIsochrone ? '✅' : '❌' }}</p>
      <p><strong>Image Proxy:</strong> {{ isImageProxy ? '✅' : '❌' }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0 0 0 / 10%);
  border: 1px solid var(--secondary-color);
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
  color: var(--text-dark);
}

.card-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.card-body p {
  font-size: 0.9rem;
  margin: 0.35rem 0;
  color: var(--text-light);
}

.logo {
  max-height: 40px;
  margin-bottom: 0.5rem;
}
</style>
