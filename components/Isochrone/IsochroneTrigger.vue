<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//
// Props
//
const props = defineProps<{
  feature: GeoJSON.Feature
}>()

//
// Emits
//
const emit = defineEmits<{
  (event: 'profileUpdate', profile: Profile): void
  (event: 'triggerClick'): void
}>()

//
// Composables
//
const { isOverlayOpen, toggleOverlay, profiles, fetchIsochrone } = useIsochrone()
const { t } = useI18n()

//
// Data
//
const loading = ref(false)
const profile = ref<Profile>()
const error = ref<string>()

//
// Methods
//
async function handleProfileUpdate(value: Profile) {
  try {
    loading.value = true

    await fetchIsochrone(props.feature, value)
    toggleOverlay()
  }
  catch (e: any) {
    error.value = e.message
  }
  finally {
    loading.value = false
    profile.value = undefined
    emit('profileUpdate', value)
  }
}

function handleTriggerClick() {
  toggleOverlay()
  emit('triggerClick')
}
</script>

<template>
  <button
    type="button"
    :title="t('isochrone.trigger.title')"
    :class="$attrs.class"
    :aria-label="t('isochrone.trigger.label')"
    @click.stop="handleTriggerClick"
  >
    <slot />
  </button>

  <VOverlay v-model="isOverlayOpen" class="align-center justify-center">
    <VCard class="mx-auto" max-width="380px" :disabled="loading" :loading="loading">
      <template #loader="{ isActive }">
        <VProgressLinear
          :active="isActive"
          color="deep-purple"
          height="4"
          indeterminate
        />
      </template>

      <template #append>
        <VBtn variant="plain" @click="toggleOverlay">
          <template #prepend>
            <FontAwesomeIcon icon="times" />
          </template>
          {{ t('ui.close') }}
        </VBtn>
      </template>

      <template #title>
        {{ t('isochrone.overlay.title') }}
      </template>

      <template #text>
        {{ t('isochrone.overlay.text') }}
        <VAlert v-if="error" type="error" :text="error" />
      </template>

      <template #actions>
        <VSpacer />
        <VBtnToggle v-model="profile" rounded="xs" variant="outlined" divided mandatory @update:model-value="handleProfileUpdate">
          <VBtn :value="profiles.foot">
            <template #prepend>
              <FontAwesomeIcon icon="walking" />
            </template>
            {{ t(`isochrone.profiles.${profiles.foot}`) }}
          </VBtn>
          <VBtn :value="profiles.cycle">
            <template #prepend>
              <FontAwesomeIcon icon="biking" />
            </template>
            {{ t(`isochrone.profiles.${profiles.cycle}`) }}
          </VBtn>
          <VBtn :value="profiles.car">
            <template #prepend>
              <FontAwesomeIcon icon="car" />
            </template>
            {{ t(`isochrone.profiles.${profiles.car}`) }}
          </VBtn>
        </VBtnToggle>
      </template>
    </VCard>
  </VOverlay>
</template>
