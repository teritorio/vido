<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import ShareLinkModal from '~/components/UI/ShareLinkModal.vue'
import { OriginEnum } from '~/utils/types'
import { urlAddTrackOrigin } from '~/utils/url'

const props = defineProps<{
  title?: string
  href?: string
  colorLine: string
}>()

const { t } = useI18n()

const shareModalRef = ref<InstanceType<typeof ShareLinkModal>>()
const shareFacebook = ref<string>()
const shareTwitter = ref<string>()
const shareWhatsApp = ref<string>()

onMounted(() => {
  shareFacebook.value = `https://www.facebook.com/share.php?${new URLSearchParams({ u: urlAddTrackOrigin(window.location.href, OriginEnum.facebook) }).toString()}`
  shareTwitter.value = `https://twitter.com/intent/tweet?${new URLSearchParams({ text: `${props.title}\n${urlAddTrackOrigin(window.location.href, OriginEnum.twitter)}` }).toString()}`
  shareWhatsApp.value = `https://api.whatsapp.com/send?${new URLSearchParams({ text: `${props.title}\n${urlAddTrackOrigin(window.location.href, OriginEnum.whatsapp)}` }).toString()}`
})

function print(): void {
  window.print()
}

function shareUrl(): void {
  if (!shareModalRef.value)
    return

  shareModalRef.value.open(window.location.href)
}
</script>

<template>
  <div>
    <IconsBar>
      <IconButton
        v-if="href"
        class="tw-w-8 tw-h-8"
        target="_blank"
        :label="t('poiDetails.shareFacebook')"
        :href="shareFacebook"
      >
        <FontAwesomeIcon
          :icon="['fab', 'facebook']"
          :style="{ color: colorLine }"
        />
      </IconButton>
      <IconButton
        v-if="title && href"
        class="tw-w-8 tw-h-8"
        target="_blank"
        :label="t('poiDetails.shareTwitter')"
        :href="shareTwitter"
      >
        <FontAwesomeIcon
          :icon="['fab', 'x-twitter']"
          :style="{ color: colorLine }"
        />
      </IconButton>
      <IconButton
        v-if="title && href"
        class="tw-w-8 tw-h-8"
        target="_blank"
        :label="t('poiDetails.shareWhatsApp')"
        :href="shareWhatsApp"
      >
        <FontAwesomeIcon
          :icon="['fab', 'whatsapp']"
          :style="{ color: colorLine }"
        />
      </IconButton>
      <IconButton
        class="tw-w-8 tw-h-8"
        :label="t('poiDetails.print')"
        @click="print"
      >
        <FontAwesomeIcon icon="print" :style="{ color: colorLine }" />
      </IconButton>
      <IconButton
        v-if="href"
        class="tw-w-8 tw-h-8"
        :label="t('poiDetails.link')"
        @click="shareUrl"
      >
        <FontAwesomeIcon icon="link" :style="{ color: colorLine }" />
      </IconButton>
    </IconsBar>
    <ShareLinkModal ref="shareModalRef" :title="t('poiDetails.link')" />
  </div>
</template>
