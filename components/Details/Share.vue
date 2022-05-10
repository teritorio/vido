<template>
  <div>
    <ul>
      <li>
        <a
          v-if="href"
          :aria-label="$tc('details.shareFacebook')"
          type="button"
          class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
          :href="shareFacebook"
          target="_black"
        >
          <font-awesome-icon
            :icon="['fab', 'facebook']"
            :style="{ color: colorLine }"
          />
        </a>
      </li>
      <li>
        <a
          v-if="title && href"
          :aria-label="$tc('details.shareTwitter')"
          type="button"
          class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
          :href="shareTwitter"
          target="_black"
        >
          <font-awesome-icon
            :icon="['fab', 'twitter']"
            :style="{ color: colorLine }"
          />
        </a>
      </li>
      <li>
        <a
          v-if="title && href"
          :aria-label="$tc('details.shareWhatsApp')"
          type="button"
          class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
          :href="shareWhatsApp"
          target="_black"
        >
          <font-awesome-icon
            :icon="['fab', 'whatsapp']"
            :style="{ color: colorLine }"
          />
        </a>
      </li>
      <li>
        <button
          :aria-label="$tc('details.print')"
          type="button"
          class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
          @click="print"
        >
          <font-awesome-icon icon="print" :style="{ color: colorLine }" />
        </button>
      </li>
      <li>
        <button
          v-if="href"
          :aria-label="$tc('details.qrcode')"
          type="button"
          class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
          @click="shareUrl"
        >
          <font-awesome-icon icon="qrcode" :style="{ color: colorLine }" />
        </button>
      </li>
      <li>
        <button
          v-if="href"
          :aria-label="$tc('details.link')"
          type="button"
          class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0 flex items-center justify-center"
          @click="shareUrl"
        >
          <font-awesome-icon icon="link" :style="{ color: colorLine }" />
        </button>
      </li>
    </ul>
    <ShareLinkModal ref="shareModal" :title="$tc('details.link')" />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'

import ShareLinkModal from '@/components/ShareLinkModal.vue'

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
        u: window.location.href,
      }).toString()

    this.shareTwitter =
      'https://twitter.com/intent/tweet?' +
      new URLSearchParams({
        text: `${this.title}\n${window.location.href}`,
      }).toString()

    this.shareWhatsApp =
      'https://api.whatsapp.com/send?' +
      new URLSearchParams({
        text: `${this.title}\n${window.location.href}`,
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
@import '@/assets/details.scss';

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
