<template>
  <TModal ref="modal" :header="title" :hide-close-button="true">
    <div class="flex flex-col">
      <LinkCopier :link="linkShare" />
      <div v-if="qrCodeUrl" class="flex items-center mb-4 justify-center">
        <img :src="qrCodeUrl()" class="w-1/2" :alt="$tc('shareLink.qrcode')" />
      </div>
      <button
        type="button"
        class="self-end focus:outline-none focus-visible:bg-zinc-100 hover:bg-zinc-100 py-2 px-4 rounded-full"
        @click="close"
      >
        {{ $tc('shareLink.close') }}
      </button>
    </div>
  </TModal>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { TModal } from 'vue-tailwind/dist/components'

import LinkCopier from '~/components/UI/LinkCopier.vue'
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
    LinkCopier,
    TModal,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
  },

  data(): {
    link: string | null
  } {
    return {
      link: null,
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

  methods: {
    open(link: string) {
      this.$tracking({ type: 'favorites_event', event: 'open_share' })
      this.link = link
      this.$refs.modal.show()

      const scrollWidth = window.innerWidth - document.body.clientWidth
      document.body.style.marginRight = `${scrollWidth}px`
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
