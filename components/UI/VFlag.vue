<script lang="ts">
import { hasFlag } from 'country-flag-icons'
import { FR, GB, ES } from 'country-flag-icons/string/3x2'
import { h, ref, watch } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  name: 'VFlag',

  props: {
    flag: {
      type: String,
      required: true,
      validator: (value: string) => {
        return hasFlag(value)
      },
    },
  },

  setup(props) {
    const svgFlag = ref(null)
    const svgs = { FR, GB, ES }
    watch(
      () => props.flag,
      async (newFlag, oldFlag) => {
        if (newFlag !== oldFlag) {
          // @ts-ignore
          svgFlag.value = svgs[newFlag]
        }
      },
      { immediate: true }
    )
    return () => h('div', { innerHTML: svgFlag.value })
  },
})
</script>
