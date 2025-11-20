<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { VEmptyState } from 'vuetify/lib/labs/components.mjs'
import { useSiteStore } from '~/stores/site'
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

const { logoUrl } = storeToRefs(useSiteStore())

const handleError = () => reloadNuxtApp({ path: '/' })
</script>

<template>
  <NuxtLayout name="error">
    <v-container :style="{ height: '100vh' }">
      <VEmptyState
        v-if="error"
        color="elevated"
        :image="logoUrl"
        :headline="$t('error.statusCode', { status: error.statusCode })"
        :text="error.message"
        :action-text="$t('error.backHome')"
        @click:action="handleError"
      />
    </v-container>
  </NuxtLayout>
</template>

<style lang="css" scoped>
:deep(.v-empty-state__text) {
  word-break: break-word;
  background-color: #202020;
  color: #d4d4d4;
  box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
  border: 1px solid #333;
  border-radius: 4px;
  padding: 15px;
}

:deep(.v-empty-state__media) {
  width: 180px;
}
</style>
