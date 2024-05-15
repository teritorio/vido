<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { storeToRefs } from 'pinia'
import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import IconButton from '~/components/UI/IconButton.vue'
import IconsBar from '~/components/UI/IconsBar.vue'
import ShareLinkModal from '~/components/UI/ShareLinkModal.vue'
import UIButton from '~/components/UI/UIButton.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { favoriteStore as useFavoriteStore } from '~/stores/favorite'
import { siteStore as useSiteStore } from '~/stores/site'

defineProps<{
  explorerModeEnabled: boolean
}>()

defineEmits<{
  (e: 'onClose'): void
  (e: 'exploreClick', poi: ApiPoi): void
  (e: 'favoriteClick', poi: ApiPoi): void
  (e: 'zoomClick', poi: ApiPoi): void
}>()

const shareModal = ref<InstanceType<typeof ShareLinkModal>>()

const favoriteStore = useFavoriteStore()
const { favoritesIds, favoriteAddresses, favoriteFeatures } = storeToRefs(favoriteStore)

const { config } = useSiteStore()
const idsStringified = [...favoritesIds.value, ...Array.from(favoriteAddresses.value.values()).map(id => `addr:${id}`)].join(',')

const pdfLink = computed(() => {
  return `${config!.API_EXPORT}/${config!.API_PROJECT}/${config!.API_THEME}/pois/favorites.pdf?ids=${favoritesIds.value.join(',')}`
})

const csvLink = computed(() => {
  return `${config!.API_ENDPOINT}/${config!.API_PROJECT}/${config!.API_THEME}/pois.csv?ids=${favoritesIds.value.join(',')}`
})

function setShareLink() {
  try {
    shareModal.value?.open(`${location.origin}/#mode=favorites&favs=${idsStringified}`)
  }
  catch (e) {
    console.error('Vido error:', (e as Error).message)
  }
}

const { $tracking } = useNuxtApp()
function exportLink(w: 'export_pdf' | 'export_csv') {
  $tracking({
    type: 'favorites_event',
    event: w,
  })
}

function removeFavorites() {
  try {
    favoriteStore.reset()
  }
  catch (e) {
    console.error('Vido error:', (e as Error).message)
  }
}
</script>

<template>
  <div
    id="favourite_notebook"
    class="tw-bg-white tw-p3 tw-h-full tw-overflow-scroll"
  >
    <div class="tw-sticky tw-p-4 tw-top-0 tw-z-20 tw-bg-white">
      <div class="tw-flex tw-justify-between tw-items-center">
        <p class="tw-text-lg">
          {{ $t('favorites.notebook.title') }}
        </p>
        <UIButton
          id="close_favourite_notebook"
          :label="$t('ui.close')"
          icon="times"
          @click="$emit('onClose')"
        />
      </div>

      <div>
        <IconsBar class="tw-mr-6">
          <IconButton
            :label="$t('favorites.menu_share')"
            class="tw-h-8"
            @click="setShareLink"
          >
            <FontAwesomeIcon icon="share-alt" />
            <span class="tw-text-sm">{{ $t('favorites.notebook.share') }}</span>
          </IconButton>
          <IconButton
            :label="$t('favorites.export_pdf')"
            class="tw-h-8"
            :href="pdfLink"
            target="_blank"
            @click="exportLink('export_pdf')"
          >
            <FontAwesomeIcon icon="print" />
            <span class="tw-text-sm">{{ $t('favorites.notebook.print') }}</span>
          </IconButton>
          <IconButton
            :label="$t('favorites.export_csv')"
            class="tw-h-8"
            :href="csvLink"
            target="_blank"
            @click="exportLink('export_csv')"
          >
            <FontAwesomeIcon icon="file-csv" />
            <span class="tw-text-sm">{{
              $t('favorites.notebook.export')
            }}</span>
          </IconButton>
          <IconButton
            :label="$t('favorites.menu_clear')"
            class="tw-h-8"
            @click="removeFavorites"
          >
            <FontAwesomeIcon icon="trash" />
            <span class="tw-text-sm">{{
              $t('favorites.notebook.remove')
            }}</span>
          </IconButton>
        </IconsBar>
      </div>
    </div>

    <PoisDeck
      :pois="favoriteFeatures"
      :is-card-light="false"
      :explorer-mode-enabled="explorerModeEnabled"
      :favorites-mode-enabled="true"
      class="tw-pb-4"
      @explore-click="$emit('exploreClick', $event)"
      @favorite-click="$emit('favoriteClick', $event)"
      @zoom-click="$emit('zoomClick', $event)"
    />

    <ShareLinkModal ref="shareModal" :title="$t('favorites.share_link')" />
  </div>
</template>
