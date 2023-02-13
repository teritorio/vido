<template>
  <TModal ref="modal" :header="title" :hide-close-button="true">
    <div class="flex flex-col">
      <div class="flex items-center mb-4">
        <font-awesome-icon
          ref="menu_icon"
          icon="link"
          class="text-zinc-500 mr-4"
        />
        <p class="text-zinc-500 truncate">
          {{ linkShare }}
        </p>
        <UIButton
          v-if="hasClipboard"
          :label="!isCopied && $tc('shareLink.copy')"
          :icon="isCopied && 'clipboard-check'"
          @click="copyLink"
        />
      </div>
      <div v-if="qrCodeUrl" class="flex items-center mb-4 justify-center">
        <img :src="qrCodeUrl()" class="w-1/2" :alt="$tc('shareLink.qrcode')" />
      </div>
      <UIButton
        :label="$tc('ui.close')"
        icon="times"
        class="self-end"
        @click="close"
      />
    </div>
  </TModal>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { TModal } from 'vue-tailwind/dist/components'

import UIButton from '~/components/UI/UIButton.vue'
import { OriginEnum } from '~/utils/types'
import { urlAddTrackOrigin } from '~/utils/url'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        modal: InstanceType<typeof TModal>
      }
    }
  >
).extend({
  components: {
    TModal,
    UIButton,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
  },

  data(): {
    link: string | null
    hasClipboard: boolean
    isCopied: boolean
  } {
    return {
      link: null,
      hasClipboard: true,
      isCopied: false,
    }
  },

  computed: {
    linkShare(): string | null {
      return this.link
        ? urlAddTrackOrigin(this.link, OriginEnum.link_share)
        : null
    },
    linkQrCode(): string | null {
      return this.link ? urlAddTrackOrigin(this.link, OriginEnum.qr_code) : null
    },
  },

  mounted() {
    this.hasClipboard = Boolean(navigator.clipboard)
  },

  methods: {
    open(link: string) {
      this.$tracking({ type: 'favorites_event', event: 'open_share' })
      this.link = link
      this.$refs.modal.show()

      const scrollWidth = window.innerWidth - document.body.clientWidth
      document.body.style.marginRight = `${scrollWidth}px`
    },

    copyLink() {
      this.$tracking({ type: 'favorites_event', event: 'copy_link' })
      if (this.hasClipboard && this.linkShare) {
        navigator.clipboard.writeText(this.linkShare).then(
          () => {
            this.isCopied = true
            setTimeout(() => {
              this.isCopied = false
            }, 5000)
          },
          (err) => {
            // eslint-disable-next-line no-console
            console.error('Vido error: ', err)
          }
        )
      }
    },

    close() {
      this.link = null
      this.$refs.modal.hide()
      document.body.style.marginRight = '0'
    },

    qrCodeUrl() {
      if (this.linkQrCode) {
        return (
          this.$vidoConfig().API_QR_SHORTENER +
          '/qrcode.svg?url=' +
          encodeURIComponent(this.linkQrCode)
        )
      }
    },
  },
})
</script>
