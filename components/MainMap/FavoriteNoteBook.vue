<template>
  <div id="favourite_notebook" class="bg-white p3">
    <div class="py-4 px-1 sm:px-6 sticky top-0 z-20 bg-white">
      <div class="flex justify-between items-center">
        <p class="text-lg">{{ $t('favorites.notebook.title') }}</p>
        <UIButton
          id="close_favourite_notebook"
          :label="$t('ui.close')"
          icon="times"
          @click="$emit('on-close')"
        />
      </div>

      <div>
        <IconsBar class="mr-6">
          <IconButton
            :label="$t('favorites.menu_share')"
            class="w-8 h-8"
            @click="setShareLink()"
          >
            <font-awesome-icon icon="share-alt" />
          </IconButton>
          <IconButton
            :label="$t('favorites.export_pdf')"
            class="w-8 h-8"
            :href="pdfLink"
            target="_blank"
            @click="exportLink('export_pdf')"
          >
            <font-awesome-icon icon="print" />
          </IconButton>
          <IconButton
            :label="$t('favorites.export_csv')"
            class="w-8 h-8"
            :href="csvLink"
            target="_blank"
            @click="exportLink('export_csv')"
          >
            <font-awesome-icon icon="file-csv" />
          </IconButton>
          <IconButton
            :label="$t('favorites.menu_clear')"
            class="w-8 h-8"
            @click="removeFavorites()"
          >
            <font-awesome-icon icon="trash" />
          </IconButton>
        </IconsBar>
      </div>
    </div>

    <PoisDeck
      :pois="favs"
      :selected-poi-ids="selectedFavsIds"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="true"
      @explore-click="$emit('explore-click', $event)"
      @favorite-click="$emit('favorite-click', $event)"
      @zoom-click="$emit('zoom-click', $event)"
    />

    <ShareLinkModal ref="shareModal" :title="$t('favorites.share_link')" />
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { PropType, ref } from 'vue'

import { defineNuxtComponent, useNuxtApp } from '#app'
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import ShareLinkModal from '~/components/UI/ShareLinkModal.vue'
import UIButton from '~/components/UI/UIButton.vue'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'
import { favoritesStore } from '~/stores/favorite'

export default defineNuxtComponent({
  components: {
    PoisDeck,
    ShareLinkModal,
    IconsBar,
    IconButton,
    UIButton,
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
      const { $vidoConfig } = useNuxtApp()
      return `${$vidoConfig().API_EXPORT}/${$vidoConfig().API_PROJECT}/${
        $vidoConfig().API_THEME
      }/pois/favorites.pdf?ids=${this.favoritesIds.join(',')}`
    },

    csvLink(): string {
      const { $vidoConfig } = useNuxtApp()
      return `${$vidoConfig().API_ENDPOINT}/${$vidoConfig().API_PROJECT}/${
        $vidoConfig().API_THEME
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
      const { $tracking } = useNuxtApp()
      $tracking({
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
