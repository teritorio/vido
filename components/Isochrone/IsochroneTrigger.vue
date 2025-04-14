<script setup lang="ts">
import { distance } from '@turf/distance'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { ProfileKeys } from '~/composables/useIsochrone'

const props = defineProps<{
  feature: GeoJSON.Feature
}>()

const emit = defineEmits<{
  (event: 'profileUpdate', profile: Profile): void
  (event: 'triggerClick'): void
}>()

const { isOverlayOpen, toggleOverlay, profiles, fetchIsochrone } = useIsochrone()
const { t } = useI18n()

const loading = ref(false)
const profile = ref<Profile>()
const error = ref<string>()

const isElligibleToIsochrone = computed(() => {
  if (!props.feature.bbox) {
    return props.feature.geometry.type === 'Point'
  }
  else {
    const [minX, minY, maxX, maxY] = props.feature.bbox

    // Create the two corner points
    const point1 = [minX, minY]
    const point2 = [maxX, maxY]

    const diagonal = distance(point1, point2, { units: 'meters' })

    // We check if the feature size is bigger than 200 meters.
    return diagonal <= 200
  }
})

//
// Methods
//
async function handleProfileUpdate(value: Profile) {
  try {
    loading.value = true

    await fetchIsochrone(props.feature, value)

    const profileTrackingLabel = Object.keys(profiles).find(key => profiles[key as ProfileKeys] === value)

    if (!profileTrackingLabel)
      throw new Error(`Tracking label for ${value} not found`)

    emit('profileUpdate', profileTrackingLabel)

    toggleOverlay()
  }
  catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    }
    else {
      error.value = 'An unknown error occurred'
    }
  }
  finally {
    loading.value = false
    profile.value = undefined
  }
}

function handleTriggerClick() {
  toggleOverlay()
  emit('triggerClick')
}
</script>

<template>
  <button
    v-show="isElligibleToIsochrone"
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
          <VBtn :value="profiles.bicycle">
            <template #prepend>
              <FontAwesomeIcon icon="biking" />
            </template>
            {{ t(`isochrone.profiles.${profiles.bicycle}`) }}
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
