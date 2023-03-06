<template>
  <div data-app class="vuetify">
    <v-dialog v-model="modal" scrollable max-width="30rem">
      <v-card>
        <v-card-title class="text-h5">{{ title }}</v-card-title>
        <v-divider class="mx-4"></v-divider>

        <div class="p-3">
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
              :label="!isCopied && $t('shareLink.copy')"
              :icon="isCopied ? 'clipboard-check' : 'copy'"
              @click="copyLink"
            />
          </div>
          <div v-if="qrCodeUrl" class="flex items-center mb-4 justify-center">
            <img
              :src="qrCodeUrl()"
              class="w-1/2"
              :alt="$t('shareLink.qrcode')"
            />
          </div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <UIButton
            :label="$t('ui.close')"
            icon="times"
            class="self-end"
            @click="close"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { useNuxtApp } from '#app'
import UIButton from '~/components/UI/UIButton.vue'
import { OriginEnum } from '~/utils/types'
import { urlAddTrackOrigin } from '~/utils/url'

export default defineComponent({
  components: {
    UIButton,
  },

  props: {
    title: {
      type: String as PropType<string>,
      required: true,
    },
  },

  data(): {
    modal: boolean
    link: string | null
    hasClipboard: boolean
    isCopied: boolean
  } {
    return {
      modal: true,
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
      const { $tracking } = useNuxtApp()
      $tracking({ type: 'favorites_event', event: 'open_share' })
      this.link = link
      this.modal = true
      console.error('open', this)

      const scrollWidth = window.innerWidth - document.body.clientWidth
      document.body.style.marginRight = `${scrollWidth}px`
    },

    copyLink() {
      const { $tracking } = useNuxtApp()
      $tracking({ type: 'favorites_event', event: 'copy_link' })
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
      this.modal = false
      document.body.style.marginRight = '0'
    },

    qrCodeUrl() {
      if (this.linkQrCode) {
        const { $vidoConfig } = useNuxtApp()
        return (
          $vidoConfig().API_QR_SHORTENER +
          '/qrcode.svg?url=' +
          encodeURIComponent(this.linkQrCode)
        )
      }
    },
  },
})
</script>

<style lang="scss">
.vuetify {
  @import 'vuetify/src/styles/styles.sass';
}
</style>
