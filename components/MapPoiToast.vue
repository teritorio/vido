<template>
  <div
    class="flex max-w-xl mx-auto overflow-hidden bg-white shadow-md pointer-events-auto rounded-xl"
    @click="() => $emit('click')"
  >
    <img
      v-if="poiProp('teritorio:image')"
      class="object-cover w-52"
      :src="poiProp('teritorio:image')"
      alt=""
    />

    <div class="p-8">
      <p
        class="block text-xl font-semibold leading-tight cursor-pointer"
        :style="'color:' + color"
      >
        {{ name }}
      </p>

      <div class="flex items-center text-sm text-gray-500 cursor-pointer">
        <TeritorioIcon
          :category-color="color"
          class="mr-2"
          :picto="icon"
          :use-category-color="true"
          :use-native-alignment="true"
        />

        {{ category }}
      </div>

      <p class="mt-2">
        <template v-if="address">
          {{ address }}
          <br />
        </template>

        <span v-for="field in listFields" :key="encodeURIComponent(field)">
          {{ field }} <br />
        </span>
      </p>

      <div class="flex items-center justify-between mt-3">
        <font-awesome-icon :icon="['far', 'star']" :color="color" />
        <template v-if="hasFiche">
          <a :href="poiProp('teritorio:url')" target="_blank" @click.stop>
            <font-awesome-icon icon="external-link-alt" :color="color" />
            Détail
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MapboxGeoJSONFeature } from 'maplibre-gl'
import Vue, { PropType } from 'vue'

import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'
import { getPoiById } from '@/utils/api'
import { VidoFeature } from '@/utils/types'

export default Vue.extend({
  components: {
    TeritorioIcon,
  },

  props: {
    poi: {
      type: Object as PropType<VidoFeature | MapboxGeoJSONFeature>,
      required: true,
    },
  },

  data(): {
    sptags: { [key: string]: any } | null
    apiProps: { [key: string]: any } | null
  } {
    return {
      sptags: null,
      apiProps: null,
    }
  },

  computed: {
    hasFiche(): boolean {
      return this.poiMeta('hasfiche') === 'yes'
    },

    name(): string {
      return this.poiProp('name') || this.poiMeta('label_infobulle')
    },

    color(): string | null {
      if (this.poiMeta('color')) {
        return this.poiMeta('color')
      } else if (this.poi && this.poi.layer && this.poi.layer.paint) {
        const tc = this.poi.layer.paint['text-color']
        return `rgba(${Math.round(tc.r * 255).toFixed(0)}, ${Math.round(
          tc.g * 255
        ).toFixed(0)}, ${Math.round(tc.b * 255).toFixed(0)}, ${tc.a})`
      } else {
        return null
      }
    },

    icon(): string {
      if (this.poiMeta('icon')) {
        return this.poiMeta('icon')
      } else if (this.poi.layer?.layout['icon-image']?.name) {
        return (
          'teritorio teritorio-tourism-' +
          this.poi.layer?.layout['icon-image']?.name.replace(/[•◯⬤]/g, '')
        )
      } else {
        return ''
      }
    },

    category(): string {
      return this.poiMeta('label_infobulle') || this.poiProp('class')
    },

    address(): string | null {
      if (this.poiMeta('PopupAdress') !== 'yes') {
        return null
      }

      return [
        this.poiProp('addr:street') &&
          this.titleCase(this.poiProp('addr:street')),
        this.poiProp('addr:postcode'),
        this.poiProp('addr:city') && this.poiProp('addr:city').toUpperCase(),
      ]
        .filter((f) => f && f.trim().length > 0)
        .join(' ')
    },

    listFields(): string[] {
      if (!this.sptags) {
        return []
      }

      return (this.poiMeta('PopupListField') || '')
        .split(';')
        .map((f: string) => {
          if (
            this.sptags !== null &&
            this.sptags[f] &&
            this.sptags[f][this.poiProp(f)]
          ) {
            return this.sptags[f][this.poiProp(f)]
          } else if (
            this.sptags !== null &&
            this.sptags[f] &&
            this.poiProp(f) &&
            this.poiProp(f).includes(';')
          ) {
            return this.poiProp(f)
              .split(';')
              .map((p: string) => this.sptags !== null && this.sptags[f][p])
              .filter((f: string) => f && f.trim().length > 0)
              .join(', ')
          } else {
            return this.poiProp(f)
          }
        })
        .filter((f: string) => f && f.trim().length > 0)
    },
  },

  watch: {
    poi() {
      this.onPoiChange()
    },
  },

  created() {
    this.onPoiChange()
  },

  methods: {
    onPoiChange() {
      // console.log(this.poi.properties)
      this.sptags = null
      this.apiProps = null
      if (this.poi && this.poiProp('metadata')) {
        this.fetchSpTags()
      } else {
        this.fetchMetadata().then(this.fetchSpTags)
      }
    },

    poiProp(name: string) {
      return this.apiProps
        ? this.apiProps[name]
        : this.poi.properties && this.poi.properties[name]
    },

    poiMeta(name: string) {
      return this.poiProp('metadata') && this.poiProp('metadata')[name]
    },

    fetchMetadata(): Promise<void> {
      if (!this.poiProp('PID')) {
        return Promise.resolve()
      }

      return getPoiById(this.$config.API_ENDPOINT, this.poiProp('PID')).then(
        (apiPoi) => {
          if (apiPoi) {
            this.apiProps = apiPoi.properties
          }
        }
      )
    },

    fetchSpTags() {
      if (!this.poiMeta('PopupListField')) {
        return
      }
      return fetch(
        `${
          this.$config.API_ENDPOINT
        }/geodata/v1/sptags?PopupListField=${this.poiMeta('PopupListField')}`
      )
        .then((data) => data.json())
        .then((data) => (this.sptags = data))
    },

    titleCase(str: string) {
      const ignoredWords = ['la', 'le', 'les', 'du', 'des', 'de', 'à', 'aux']
      return str
        .toLowerCase()
        .split(' ')
        .filter((word) => word.length > 0)
        .map(function (word) {
          return ignoredWords.includes(word.toLowerCase())
            ? word
            : word.replace(word[0], word[0].toUpperCase())
        })
        .join(' ')
    },
  },
})
</script>
