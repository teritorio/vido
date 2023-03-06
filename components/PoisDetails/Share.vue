<template>
  <div>
    <IconsBar>
      <IconButton
        v-if="href"
        :aria-label="$tc('poiDetails.shareFacebook')"
        class="w-8 h-8"
        :href="shareFacebook"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'facebook']"
          :style="{ color: colorLine }"
        />
      </IconButton>
      <IconButton
        v-if="title && href"
        :aria-label="$tc('poiDetails.shareTwitter')"
        class="w-8 h-8"
        :href="shareTwitter"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'twitter']"
          :style="{ color: colorLine }"
        />
      </IconButton>
      <IconButton
        v-if="title && href"
        :aria-label="$tc('poiDetails.shareWhatsApp')"
        class="w-8 h-8"
        :href="shareWhatsApp"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'whatsapp']"
          :style="{ color: colorLine }"
        />
      </IconButton>
      <IconButton
        :aria-label="$tc('poiDetails.print')"
        class="w-8 h-8"
        @click="print"
      >
        <font-awesome-icon icon="print" :style="{ color: colorLine }" />
      </IconButton>
      <IconButton
        v-if="href"
        :aria-label="$tc('poiDetails.link')"
        class="w-8 h-8"
        @click="shareUrl"
      >
        <font-awesome-icon icon="link" :style="{ color: colorLine }" />
      </IconButton>
    </IconsBar>
    <ShareLinkModal ref="shareModal" :title="$tc('poiDetails.link')" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue'

import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import ShareLinkModal from '~/components/UI/ShareLinkModal.vue'
import { OriginEnum } from '~/utils/types'
import { urlAddTrackOrigin } from '~/utils/url'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        shareModal: InstanceType<typeof ShareLinkModal>
      }
    }
  >
).extend({
  components: {
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
    this.shareFacebook =
      'https://www.facebook.com/share.php?' +
      new URLSearchParams({
        u: urlAddTrackOrigin(window.location.href, OriginEnum.facebook),
      }).toString()

    this.shareTwitter =
      'https://twitter.com/intent/tweet?' +
      new URLSearchParams({
        text:
          `${this.title}\n` +
          urlAddTrackOrigin(window.location.href, OriginEnum.twitter),
      }).toString()

    this.shareWhatsApp =
      'https://api.whatsapp.com/send?' +
      new URLSearchParams({
        text:
          `${this.title}\n` +
          urlAddTrackOrigin(window.location.href, OriginEnum.whatsapp),
      }).toString()
  },

  methods: {
    print() {
      window.print()
    },
    shareUrl() {
      this.$refs.shareModal.open(window.location.href)
    },
  },
})
</script>
