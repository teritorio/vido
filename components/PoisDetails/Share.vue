<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'
import { ref } from 'vue'

import { defineNuxtComponent } from '#app'
import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import ShareLinkModal from '~/components/UI/ShareLinkModal.vue'
import { OriginEnum } from '~/utils/types'
import { urlAddTrackOrigin } from '~/utils/url'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    IconsBar,
    IconButton,
    ShareLinkModal,
  },

  props: {
    title: {
      type: String as PropType<string>,
      default: null,
    },
    href: {
      type: String as PropType<string>,
      default: null,
    },
    colorLine: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup() {
    return {
      shareModal: ref<InstanceType<typeof ShareLinkModal>>(),
    }
  },

  data(): {
    shareFacebook: string | undefined
    shareTwitter: string | undefined
    shareWhatsApp: string | undefined
  } {
    return {
      shareFacebook: undefined,
      shareTwitter: undefined,
      shareWhatsApp: undefined,
    }
  },

  mounted() {
    this.shareFacebook
      = `https://www.facebook.com/share.php?${
       new URLSearchParams({
        u: urlAddTrackOrigin(window.location.href, OriginEnum.facebook),
      }).toString()}`

    this.shareTwitter
      = `https://twitter.com/intent/tweet?${
       new URLSearchParams({
        text:
          `${this.title}\n${
          urlAddTrackOrigin(window.location.href, OriginEnum.twitter)}`,
      }).toString()}`

    this.shareWhatsApp
      = `https://api.whatsapp.com/send?${
       new URLSearchParams({
        text:
          `${this.title}\n${
          urlAddTrackOrigin(window.location.href, OriginEnum.whatsapp)}`,
      }).toString()}`
  },

  methods: {
    print() {
      window.print()
    },
    shareUrl() {
      this.shareModal?.open(window.location.href)
    },
  },
})
</script>

<template>
  <div>
    <IconsBar>
      <IconButton
        v-if="href"
        :label="$t('poiDetails.shareFacebook')"
        class="tw-w-8 tw-h-8"
        :href="shareFacebook"
        target="_blank"
      >
        <FontAwesomeIcon
          :icon="['fab', 'facebook']"
          :style="{ color: colorLine }"
        />
      </IconButton>
      <IconButton
        v-if="title && href"
        :label="$t('poiDetails.shareTwitter')"
        class="tw-w-8 tw-h-8"
        :href="shareTwitter"
        target="_blank"
      >
        <FontAwesomeIcon
          :icon="['fab', 'x-twitter']"
          :style="{ color: colorLine }"
        />
      </IconButton>
      <IconButton
        v-if="title && href"
        :label="$t('poiDetails.shareWhatsApp')"
        class="tw-w-8 tw-h-8"
        :href="shareWhatsApp"
        target="_blank"
      >
        <FontAwesomeIcon
          :icon="['fab', 'whatsapp']"
          :style="{ color: colorLine }"
        />
      </IconButton>
      <IconButton
        :label="$t('poiDetails.print')"
        class="tw-w-8 tw-h-8"
        @click="print"
      >
        <FontAwesomeIcon icon="print" :style="{ color: colorLine }" />
      </IconButton>
      <IconButton
        v-if="href"
        :label="$t('poiDetails.link')"
        class="tw-w-8 tw-h-8"
        @click="shareUrl"
      >
        <FontAwesomeIcon icon="link" :style="{ color: colorLine }" />
      </IconButton>
    </IconsBar>
    <ShareLinkModal ref="shareModal" :title="$t('poiDetails.link')" />
  </div>
</template>
