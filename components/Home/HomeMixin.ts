import Vue, { PropType, VueConstructor } from 'vue'
import { mapActions } from 'vuex'

import MapFeatures from '~/components/MainMap/MapFeatures.vue'
import { ApiMenuCategory, MenuItem } from '~/lib/apiMenu'
import { ApiPoi } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        mapFeatures: InstanceType<typeof MapFeatures>
        bottomMenu: HTMLDivElement
      }
    }
  >
).extend({
  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
  },

  computed: {
    menuItems(): Record<ApiMenuCategory['id'], MenuItem> {
      return this.$store.getters['menu/menuItems']
    },

    favoritesModeEnabled(): boolean {
      return this.settings.themes[0]?.favorites_mode ?? true
    },

    explorerModeEnabled(): boolean {
      return this.settings.themes[0]?.explorer_mode ?? true
    },

    selectedFeature(): ApiPoi {
      return this.$store.getters['map/selectedFeature']
    },
  },

  methods: {
    ...mapActions({
      setMode: 'map/setMode',
    }),

    goToSelectedFeature() {
      this.$refs.mapFeatures?.goToSelectedFeature()
    },
  },
})
