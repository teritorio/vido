<template>
  <div>
    <ul>
      <li>
        <a
          v-if="href"
          :aria-label="$tc('details.shareFacebook')"
          type="button"
          class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
          :href="shareFacebook"
          target="_black"
        >
          <font-awesome-icon
            :icon="['fab', 'facebook']"
            :style="{ color: color }"
          />
        </a>
      </li>
      <li>
        <a
          v-if="title && href"
          :aria-label="$tc('details.shareTwitter')"
          type="button"
          class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
          :href="shareTwitter"
          target="_black"
        >
          <font-awesome-icon
            :icon="['fab', 'twitter']"
            :style="{ color: color }"
          />
        </a>
      </li>
      <li>
        <a
          v-if="title && href"
          :aria-label="$tc('details.shareWhatsApp')"
          type="button"
          class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
          :href="shareWhatsApp"
          target="_black"
        >
          <font-awesome-icon
            :icon="['fab', 'whatsapp']"
            :style="{ color: color }"
          />
        </a>
      </li>
      <li>
        <button
          :aria-label="$tc('details.print')"
          type="button"
          class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
          @click="print"
        >
          <font-awesome-icon icon="print" :style="{ color: color }" />
        </button>
      </li>
      <li>
        <button
          v-if="href"
          :aria-label="$tc('details.link')"
          type="button"
          class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-8 h-8 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0"
          @click="shareUrl"
        >
          <font-awesome-icon icon="link" :style="{ color: color }" />
        </button>
      </li>
    </ul>
    <ShareLinkModal
      :title="$tc('details.link')"
      :link="shareLink"
      @close="shareLink = null"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import ShareLinkModal from '@/components/ShareLinkModal.vue'

export default Vue.extend({
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
    color: {
      type: String,
      required: true,
    },
  },

  data(): {
    shareFacebook: string | null
    shareTwitter: string | null
    shareWhatsApp: string | null
    shareLink: string | null
  } {
    return {
      shareFacebook: null,
      shareTwitter: null,
      shareWhatsApp: null,
      shareLink: null,
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
      this.shareLink = window.location.href
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
