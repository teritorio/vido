<template>
  <div id="favourite_notebook">
    <div
      class="flex justify-between items-center py-4 px-1 sm:px-6 sticky top-0 z-20 bg-white"
    >
      <p class="text-lg">{{ $tc('favorites.notebook.title') }}</p>
      <button
        id="close_favourite_notebook"
        type="button"
        class="flex items-center border-solid border-zinc-300 border-2 bg-white focus:outline-none focus-visible:bg-zinc-100 hover:bg-zinc-100 py-2 px-4 rounded-full"
        @click="$emit('on-close')"
      >
        <font-awesome-icon
          ref="menu_icon"
          icon="times"
          class="text-zinc-500 sm:mr-2"
          size="sm"
        />
        <span class="hidden sm:block">{{
          $tc('favorites.notebook.close')
        }}</span>
      </button>
    </div>

    <IconsBar>
      <IconButton
        :aria-label="$tc('favorites.menu_share')"
        class="w-8 h-8"
        @click="setShareLink()"
      >
        <font-awesome-icon icon="share-alt" />
      </IconButton>
      <IconButton
        :aria-label="$tc('favorites.export_pdf')"
        class="w-8 h-8"
        :href="pdfLink"
        target="_blank"
        @click="exportLink('export_pdf')"
      >
        <font-awesome-icon icon="file-download" />
      </IconButton>
      <IconButton
        :aria-label="$tc('poisTable.downloadGeojson')"
        class="w-8 h-8"
        :href="csvLink"
        target="_blank"
        @click="exportLink('export_csv')"
      >
        <font-awesome-icon icon="file-download" />
      </IconButton>
      <IconButton
        :aria-label="$tc('favorites.menu_clear')"
        class="w-8 h-8"
        @click="removeFavorites()"
      >
        <font-awesome-icon icon="trash" />
      </IconButton>
    </IconsBar>

    <PoisDeck
      :pois="favs"
      :notebook="true"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="true"
      @explore-click="$emit('explore-click', $event)"
      @favorite-click="$emit('favorite-click', $event)"
      @zoom-click="$emit('zoom-click', $event)"
    />

    <ShareLinkModal ref="shareModal" :title="$tc('favorites.share_link')" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue'
import { mapGetters } from 'vuex'

import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import ShareLinkModal from '~/components/UI/ShareLinkModal.vue'
import { ApiPoi } from '~/lib/apiPois'

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
    PoisDeck,
    ShareLinkModal,
    IconsBar,
    IconButton,
  },

  props: {
    favs: {
      type: Array as PropType<ApiPoi[]>,
      default: undefined,
    },
    explorerModeEnabled: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      favoritesIds: 'favorite/favoritesIds',
    }),

    pdfLink(): string {
      return `${this.$vidoConfig().API_EXPORT}/${
        this.$vidoConfig().API_PROJECT
      }/${
        this.$vidoConfig().API_THEME
      }/pois/favorites.pdf?ids=${this.favoritesIds.join(',')}`
    },

    csvLink(): string {
      return `${this.$vidoConfig().API_ENDPOINT}/${
        this.$vidoConfig().API_PROJECT
      }/${this.$vidoConfig().API_THEME}/pois.csv?ids=${this.favoritesIds.join(
        ','
      )}`
    },
  },

  methods: {
    setShareLink() {
      try {
        this.$refs.shareModal.open(
          `${location.origin}/#mode=favorites&favs=${this.favoritesIds.join(
            ','
          )}`
        )
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },

    exportLink(w: 'export_pdf' | 'export_csv') {
      this.$tracking({
        type: 'favorites_event',
        event: w,
      })
    },

    removeFavorites() {
      try {
        this.$store.dispatch('favorite/setFavorites', [])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },
  },
})
</script>
