<template>
  <div
    id="favourite_notebook"
    class="tw-bg-white tw-p3 tw-h-full tw-overflow-scroll"
  >
    <div class="tw-sticky tw-p-4 tw-top-0 tw-z-20 tw-bg-white">
      <div class="tw-flex tw-justify-between tw-items-center">
        <p class="tw-text-lg">{{ $t('favorites.notebook.title') }}</p>
        <UIButton
          id="close_favourite_notebook"
          :label="$t('ui.close')"
          icon="times"
          @click="$emit('on-close')"
        />
      </div>

      <div>
        <IconsBar class="tw-mr-6">
          <IconButton
            :label="$t('favorites.menu_share')"
            class="tw-h-8"
            @click="setShareLink()"
          >
            <FontAwesomeIcon icon="share-alt" />
            <p class="tw-text-sm">{{ $t('favorites.notebook.share') }}</p>
          </IconButton>
          <IconButton
            :label="$t('favorites.export_pdf')"
            class="tw-h-8"
            :href="pdfLink"
            target="_blank"
            @click="exportLink('export_pdf')"
          >
            <FontAwesomeIcon icon="print" />
            <p class="tw-text-sm">{{ $t('favorites.notebook.print') }}</p>
          </IconButton>
          <IconButton
            :label="$t('favorites.export_csv')"
            class="tw-h-8"
            :href="csvLink"
            target="_blank"
            @click="exportLink('export_csv')"
          >
            <FontAwesomeIcon icon="file-csv" />
            <p class="tw-text-sm">{{ $t('favorites.notebook.export') }}</p>
          </IconButton>
          <IconButton
            :label="$t('favorites.menu_clear')"
            class="tw-h-8"
            @click="removeFavorites()"
          >
            <FontAwesomeIcon icon="trash" />
            <p class="tw-text-sm">{{ $t('favorites.notebook.remove') }}</p>
          </IconButton>
        </IconsBar>
      </div>
    </div>

    <PoisDeck
      :pois="favs"
      :selected-poi-ids="selectedFavsIds"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="true"
      class="tw-pb-4"
      @explore-click="$emit('explore-click', $event)"
      @favorite-click="$emit('favorite-click', $event)"
      @zoom-click="$emit('zoom-click', $event)"
    />

    <ShareLinkModal ref="shareModal" :title="$t('favorites.share_link')" />
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapState } from 'pinia'
import { PropType, ref } from 'vue'

import { defineNuxtComponent, useRequestHeaders } from '#app'
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import ShareLinkModal from '~/components/UI/ShareLinkModal.vue'
import UIButton from '~/components/UI/UIButton.vue'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'
import { favoritesStore } from '~/stores/favorite'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    PoisDeck,
    ShareLinkModal,
    IconsBar,
    IconButton,
    UIButton,
  },

  emits: {
    'on-close': () => true,
    'zoom-click': (_poi: ApiPoi) => true,
    'explore-click': (_poi: ApiPoi) => true,
    'favorite-click': (_poi: ApiPoi) => true,
  },

  props: {
    favs: {
      type: Array as PropType<ApiPoi[]>,
      required: true,
    },
    selectedFavsIds: {
      type: Array as PropType<ApiPoiId[]>,
      required: true,
    },
    explorerModeEnabled: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    return {
      shareModal: ref<InstanceType<typeof ShareLinkModal>>(),
    }
  },

  computed: {
    ...mapState(favoritesStore, ['favoritesIds']),

    pdfLink(): string {
      const config = this.$vidoConfig(useRequestHeaders())
      return `${config.API_EXPORT}/${config.API_PROJECT}/${
        config.API_THEME
      }/pois/favorites.pdf?ids=${this.favoritesIds.join(',')}`
    },

    csvLink(): string {
      const config = this.$vidoConfig(useRequestHeaders())
      return `${config.API_ENDPOINT}/${config.API_PROJECT}/${
        config.API_THEME
      }/pois.csv?ids=${this.favoritesIds.join(',')}`
    },
  },

  methods: {
    setShareLink() {
      try {
        this.shareModal!.open(
          `${location.origin}/#mode=favorites&favs=${this.favoritesIds.join(
            ','
          )}`
        )
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', (e as Error).message)
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
        favoritesStore().setFavorites([])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', (e as Error).message)
      }
    },
  },
})
</script>
