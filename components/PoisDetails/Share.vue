<template>
  <div>
    <ul>
      <li v-if="href">
        <IconButton
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
      </li>
      <li v-if="title && href">
        <IconButton
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
      </li>
      <li v-if="title && href">
        <IconButton
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
      </li>
      <li>
        <IconButton
          :aria-label="$tc('poiDetails.print')"
          class="w-8 h-8"
          @click="print"
        >
          <font-awesome-icon icon="print" :style="{ color: colorLine }" />
        </IconButton>
      </li>
      <li v-if="href">
        <IconButton
          :aria-label="$tc('poiDetails.link')"
          class="w-8 h-8"
          @click="shareUrl"
        >
          <font-awesome-icon icon="link" :style="{ color: colorLine }" />
        </IconButton>
      </li>
    </ul>
    <ShareLinkModal ref="shareModal" :title="$tc('poiDetails.link')" />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'

import IconButton from '~/components/UI/IconButton.vue'
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
    IconButton,
    ShareLinkModal,
  },

  props: {
    title: {
      type: String,
      default: null,
    },
    href: {
      type: String,
      default: null,
    },
    colorLine: {
      type: String,
      required: true,
    },
  },

  data(): {
    shareFacebook: string | null
    shareTwitter: string | null
    shareWhatsApp: string | null
  } {
    return {
      shareFacebook: null,
      shareTwitter: null,
      shareWhatsApp: null,
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

<style lang="scss" scoped>
@import '~/assets/details.scss';

ul {
  position: relative;
  display: block;
  width: 100%;
  text-align: right;
  margin-bottom: 0.6rem;
  list-style: none;

  li {
    display: inline-block;
    margin: 0.3rem;
    border-radius: 50%;
  }
}

@media (max-width: 991px) {
  ul {
    text-align: center;
  }
}
</style>
