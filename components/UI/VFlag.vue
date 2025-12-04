<script setup lang="ts">
import { hasFlag } from 'country-flag-icons'
import { ES, FR, GB } from 'country-flag-icons/string/3x2'

type CountryCode = keyof typeof svgs

const props = defineProps<{
  flag: CountryCode
}>()

const svgs = { FR, GB, ES } as const
const svgFlag = ref<string>()

if (!hasFlag(props.flag)) {
  console.warn(`Invalid country code: ${props.flag}`)
}

watch(() => props.flag, (newFlag: CountryCode) => {
  svgFlag.value = svgs[newFlag] || undefined
}, { immediate: true })
</script>

<template>
  <div v-html="svgFlag" />
</template>
