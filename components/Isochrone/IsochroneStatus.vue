<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const { t } = useI18n()
const { reset, isochroneCurrentFeature } = useIsochrone()

if (!isochroneCurrentFeature.value)
  throw createError('Missing current feature.')

if (!isochroneCurrentFeature.value.properties?.display?.color_fill)
  throw createError(`Feature ${isochroneCurrentFeature.value.id} is missing color_fill`)

const { colorFill: color_fill, colorText: color_text } = useContrastedColors(
  isochroneCurrentFeature.value.properties.display.color_fill,
  isochroneCurrentFeature.value.properties.display.color_text,
)
</script>

<template>
  <div class="tw-relative tw-self-start tw-p-2 tw-bg-white tw-shadow-md tw-rounded-xl tw-pointer-events-auto">
    <div>
      <div class="icon">
        <FontAwesomeIcon color="#000000" icon="clock" size="sm" />
      </div>
    </div>
    <span class="tw-text-sm">{{ t('isochrone.trigger.label') }}</span>
    <button
      type="button"
      class="tw-absolute -tw-top-3 -tw-right-3 tw-pointer-events-auto tw-flex tw-items-center tw-justify-center tw-text-white tw-text-center tw-rounded-full tw-w-7 tw-h-7 tw-border-solid tw-border-2 tw-border-white tw-bg-red-600 hover:tw-bg-red-800"
      :title="t('isochrone.remove')"
      :aria-label="t('isochrone.remove')"
      @click="reset"
    >
      <FontAwesomeIcon icon="times" class="tw-text-white" />
    </button>
  </div>
</template>

<style lang="css" scoped>
div > div,
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

div > div {
  flex-direction: column;
}

.icon {
  border-radius: 100%;
  background-color: v-bind(color_fill);
  width: 40px;
  height: 40px;
}

.icon svg {
  color: v-bind(color_text);
}
</style>
