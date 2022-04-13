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
          {{ link }}
        </p>
        <button
          v-if="hasClipboard"
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
      <button
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

  mounted() {
    this.hasClipboard = Boolean(navigator.clipboard)
  },

  methods: {
    open(link: string) {
      this.link = link
      this.$refs.modal.show()

      const scrollWidth = window.innerWidth - document.body.clientWidth
      document.body.style.marginRight = `${scrollWidth}px`
    },
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
    close() {
      this.link = null
      this.$refs.modal.hide()
      document.body.style.marginRight = '0'
    },
  },
})
</script>
