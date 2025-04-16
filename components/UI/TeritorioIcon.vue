<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

  props: {
    colorText: {
      type: String as PropType<string>,
      rdefault: '#ffffff',
    },
    picto: {
      type: String as PropType<string>,
      required: true,
    },
    useNativeAlignment: {
      type: Boolean,
      default: null,
    },
    image: {
      type: String as PropType<string>,
      default: null,
    },
  },
})
</script>

<template>
  <i
    v-if="!Boolean(image) && (picto.startsWith('teritorio') || picto.startsWith('glyphicons'))"
    :class="[
      picto,
      !useNativeAlignment && 'tw-flex tw-items-center tw-justify-center',
    ]"
    :style="{ color: colorText }"
  />
  <FontAwesomeIcon
    v-else-if="!Boolean(image)"
    :icon="picto"
    :color="colorText"
  />
  <img v-else-if="Boolean(image)" class="tw-rounded-full" :src="image">
</template>
