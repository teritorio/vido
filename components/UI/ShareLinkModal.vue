<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { VCard, VCardActions, VCardTitle } from 'vuetify/components/VCard'
import { VDialog } from 'vuetify/components/VDialog'
import { VDivider } from 'vuetify/components/VDivider'
import { VSpacer } from 'vuetify/components/VGrid'
import UIButton from '~/components/UI/UIButton.vue'
import { OriginEnum } from '~/utils/types'
import { urlAddTrackOrigin } from '~/utils/url'

defineProps<{
  title: string
}>()

const { apiQrShortener } = useRuntimeConfig().public

const modal = shallowRef<boolean>(false)
const link = shallowRef<string>()
const hasClipboard = shallowRef<boolean>(true)
const isCopied = shallowRef<boolean>(false)

const linkShare = computed((): string | null => {
  return link.value
    ? urlAddTrackOrigin(link.value, OriginEnum.link_share)
    : null
})
const linkQrCode = computed((): string | null => {
  return link.value ? urlAddTrackOrigin(link.value, OriginEnum.qr_code) : null
})

onMounted(() => {
  hasClipboard.value = Boolean(navigator.clipboard)
})

const { $tracking } = useNuxtApp()

function open(l: string) {
  $tracking({ type: 'favorites_event', event: 'open_share' })
  link.value = l
  modal.value = true

  const scrollWidth = window.innerWidth - document.body.clientWidth
  document.body.style.marginRight = `${scrollWidth}px`
}

function copyLink() {
  $tracking({ type: 'favorites_event', event: 'copy_link' })

  if (hasClipboard.value && linkShare.value) {
    navigator.clipboard.writeText(linkShare.value).then(
      () => {
        isCopied.value = true

        setTimeout(() => {
          isCopied.value = false
        }, 5000)
      },
      (err) => {
        console.error('Vido error: ', err)
      },
    )
  }
}

function close() {
  link.value = undefined
  modal.value = false
  document.body.style.marginRight = '0'
}

function qrCodeUrl() {
  if (linkQrCode.value) {
    return `${apiQrShortener}/qrcode.svg?url=${encodeURIComponent(linkQrCode.value)}`
  }
}

defineExpose({ open })
</script>

<template>
  <div>
    <VDialog v-model="modal" scrollable max-width="30rem">
      <VCard>
        <VCardTitle class="tw-text-h5">
          {{ title }}
        </VCardTitle>
        <VDivider class="tw-mx-4" />

        <div class="tw-p-3">
          <div class="tw-flex tw-items-center tw-mb-4">
            <FontAwesomeIcon
              ref="menu_icon"
              icon="link"
              class="tw-text-zinc-500 tw-mr-4"
            />
            <p class="tw-text-zinc-500 tw-truncate">
              {{ linkShare }}
            </p>
            <UIButton
              v-if="hasClipboard"
              :label="(!isCopied && $t('shareLink.copy')) || undefined"
              :icon="isCopied ? 'clipboard-check' : 'copy'"
              @click="copyLink"
            />
          </div>
          <div
            v-if="qrCodeUrl"
            class="tw-flex tw-items-center tw-mb-4 tw-justify-center"
          >
            <img
              :src="qrCodeUrl()"
              class="tw-w-1/2"
              :alt="$t('shareLink.qrcode')"
            >
          </div>
        </div>

        <VCardActions>
          <VSpacer />
          <UIButton
            :label="$t('ui.close')"
            icon="times"
            class="self-end"
            @click="close"
          />
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
