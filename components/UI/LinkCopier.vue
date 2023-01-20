<template>
  <div class="flex items-center mb-4">
    <font-awesome-icon ref="menu_icon" icon="link" class="text-zinc-500 mr-4" />
    <p class="text-zinc-500 truncate">
      {{ link }}
    </p>
    <button
      v-if="hasClipboard"
      type="button"
      class="focus:outline-none focus-visible:bg-zinc-100 hover:bg-zinc-100 py-2 px-4 rounded-full ml-2"
      @click="copyLink"
    >
      <font-awesome-icon
        v-if="isCopied"
        ref="menu_icon"
        icon="clipboard-check"
        class="text-emerald-500"
      />
      {{ !isCopied ? $tc('shareLink.copy') : '' }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    link: {
      type: String,
      required: true,
    },
  },

  data(): {
    hasClipboard: boolean
    isCopied: boolean
  } {
    return {
      hasClipboard: true,
      isCopied: false,
    }
  },

  mounted() {
    this.hasClipboard = Boolean(navigator.clipboard)
  },

  methods: {
    copyLink() {
      this.$tracking({ type: 'favorites_event', event: 'copy_link' })
      if (this.hasClipboard && this.link) {
        navigator.clipboard.writeText(this.link).then(
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
  },
})
</script>
