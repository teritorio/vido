<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//
// Props
//
const props = defineProps<{
  feature: GeoJSON.Feature
}>()

//
// Composables
//
const { isOverlayOpen, toggleOverlay, profiles, calculate } = useIsochrone()

//
// Data
//
const loading = ref(false)
const profile = ref<Profile>(profiles.foot)

//
// Methods
//
async function fetchIsochrone() {
  try {
    loading.value = true

    await calculate(props.feature, profile.value)
  }
  catch (e: any) {}
  finally {
    loading.value = false
    toggleOverlay()
  }
}
</script>

<template>
  <VBtn :class="$attrs.class" aria-label="Isochrone" @click.stop="toggleOverlay">
    <slot />
  </VBtn>

  <VOverlay v-model="isOverlayOpen" class="align-center justify-center">
    <VCard :disabled="loading" :loading="loading">
      <template #loader="{ isActive }">
        <VProgressLinear
          :active="isActive"
          color="deep-purple"
          height="4"
          indeterminate
        />
      </template>

      <VCardTitle>
        Routing profile
      </VCardTitle>

      <VBtnToggle v-model="profile" mandatory>
        <VBtn :value="profiles.foot">
          <FontAwesomeIcon icon="walking" />
        </VBtn>
        <VBtn :value="profiles.cycle">
          <FontAwesomeIcon icon="biking" />
        </VBtn>
        <VBtn :value="profiles.car">
          <FontAwesomeIcon icon="car" />
        </VBtn>
      </VBtnToggle>

      <VCardActions>
        <VBtn text="Calculate" @click="fetchIsochrone" />
      </VCardActions>
    </VCard>
  </VOverlay>
</template>
